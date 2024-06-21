import type { NextApiRequest, NextApiResponse } from 'next'
import { getAgent } from './veramo/setup'
import { registerCredential } from '../../lib/ethers/registerCredential'

// This is a test on how to create a verifiable credential with veramo.
const createCredentialTest = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  // Get FID from session, pass to the 'getAgent' function.
  // Passing this 'state' will apply proper passing of fid to key and did stores,
  // and will allow for proper access control ( filtering ) of what keys/dids user can access.
  const agent = await getAgent({
    fid: 470223
  })

  const userDecentralizedIdentifier = await agent.didManagerGetOrCreate({
    kms: 'local',
    provider: 'did:pkh',
    options: { network: 'eip155', chainId: '1' },
    alias: (470223).toString() // pass fid as alias, too.
  })

  const credentialSubject = {
    fid: 470223,
    answer: 'Linux',
    question: 'Which of the following is your preferred operating system?',
    casterFid: 294394,
    timestamp: Date.now()
  }

  const credentialType = 'IntoriAnswerCredential'
  const credentialId = userDecentralizedIdentifier.did + 470223

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

  await registerCredential(
    verifiableCredential,
    userDecentralizedIdentifier
  )

  return res.status(200).json({
    verifiableCredential
  })
}

export default createCredentialTest
