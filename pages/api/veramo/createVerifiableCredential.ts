import { UserAnswerType } from '../../../models/userAnswers'
import { getAgent } from './setup'

export const createVerifiableCredential = async (
  userResponse: UserAnswerType
) => {
  const { fid, casterFid, answer, question } = userResponse

  const agent = await getAgent({ fid })

  const userDecentralizedIdentifier = await agent.didManagerGetOrCreate({
    kms: 'local',
    provider: 'did:pkh',
    options: { network: 'eip155', chainId: '1' },
    alias: fid.toString()
  })

  const credentialSubject = {
    fid,
    answer,
    question,
    casterFid,
    timestamp: Date.now()
  }

  const credentialType = 'IntoriAnswerCredential'
  const credentialId = userDecentralizedIdentifier.did + fid

  const verifiableCredential = await agent.createVerifiableCredential({
    proofFormat: 'jwt',
    credential: {
      id: credentialId,
      credentialSubject,
      type: [credentialType],
      issuer: {
        id: userDecentralizedIdentifier.did
      }
    }
  })

  return {
    verifiableCredential,
    userDecentralizedIdentifier
  }
}
