import type { ProofFormat, W3CVerifiableCredential } from '@veramo/core'
import cloneDeep from 'lodash.clonedeep'
import { v4 as uuidv4 } from 'uuid'
import type { VeramoState } from './interfaces'
import type {
  IDataManagerSaveResult,
  ISaveVC,
  SaveOptions
} from './plugins/verifiable-creds-manager'
import { getVeramoAgent } from './setup'
import type {
  CreateVCRequestParams,
  CreateVCResponseResult
} from './types/params'

export async function createVC(
  state: VeramoState,
  vcRequestParams: CreateVCRequestParams
): Promise<CreateVCResponseResult> {
  // Get Veramo agent
  const agent = await getVeramoAgent(state)

  // GET DID
  const { did } = state.currentAccount

  const {
    vcKey = 'vcData',
    vcValue,
    credTypes = [],
    options
  } = vcRequestParams || {}
  const { store = 'intori' } = options || {}
  const optionsFiltered = { store } as SaveOptions

  console.log(
    'Creating a VC for: ',
    JSON.stringify(
      {
        [vcKey]: vcValue
      },
      null,
      4
    )
  )

  const issuanceDate = new Date()
  // Set the expiration date to be 1 year from the date it's issued
  const expirationDate = cloneDeep(issuanceDate)
  expirationDate.setFullYear(
    issuanceDate.getFullYear() + 1,
    issuanceDate.getMonth(),
    issuanceDate.getDate()
  )

  const credential = new Map<string, unknown>()
  credential.set('issuanceDate', issuanceDate.toISOString()) // the entity that issued the credential+
  credential.set('expirationDate', expirationDate.toISOString()) // when the credential was issued
  credential.set('type', credTypes)

  const issuer: { id: string } = { id: did }
  const credentialSubject: { id: string } = {
    id: did, // identifier for the only subject of the credential
    [vcKey]: vcValue // assertion about the only subject of the credential
  }
  credential.set('issuer', issuer) // the entity that issued the credential
  credential.set('credentialSubject', credentialSubject)

  // Generate a Verifiable Credential
  const verifiableCredential: W3CVerifiableCredential =
    await agent.createVerifiableCredential({
      credential: JSON.parse(JSON.stringify(Object.fromEntries(credential))),
      // digital proof that makes the credential tamper-evident
      proofFormat: 'jwt' as ProofFormat
    })

  // Save the Verifiable Credential to all the stores the user requested for
  const saved: IDataManagerSaveResult[] = await agent.saveVC({
    data: [{ vc: verifiableCredential, id: uuidv4() }] as ISaveVC[],
    options: optionsFiltered
  })

  // Retrieve the created Verifiable Credential
  const result: CreateVCResponseResult = {
    data: verifiableCredential,
    metadata: {
      id: saved[0].id,
      store: saved.map((res) => res.store)
    }
  }

  console.log('Created and saved verifiableCredential: ', result.metadata)
  return result
}
