import type { NextApiRequest, NextApiResponse } from 'next'
import { frameSubmissionHelpers } from '../../../utils/frames/frameSubmissionHelpers'

// example farcaster frame submit
// console.log({
//     body: {
//       untrustedData: {
//         fid: 470223,
//         url: 'https://intori.tyhacz.com/frame/step-1?r=23123123',
//         messageHash: '0x8055ff77e3c87a0e9d705a9eb54e4c44676992a2',
//         timestamp: 1712863849000,
//         network: 1,
//         buttonIndex: 1,
//         castId: { fid: 470223, hash: '0xa2d09624cdd4fe2c5250506d21f606f80a1e9e6c' }
//       },
//       trustedData: {
//         messageBytes: '0a61080d10cfd91c18e9a8a73120018201510a3168747470733a2f2f696e746f72692e74796861637a2e636f6d2f6672616d652f737465702d313f723d323331323331323310011a1a08cfd91c1214a2d09624cdd4fe2c5250506d21f606f80a1e9e6c12148055ff77e3c87a0e9d705a9eb54e4c44676992a218012240890cc3a5641f3ffaf997d857d72d6c0232c916039e711975790a2c8ca6e55a335f4c1326f4c89716a3d1cd8bb42e697cbb3a8f644d74947c3ce9a42d11c7be0b2801322028e64131458f85cd6f4bb0c0a5227ae387ac85c31975c7dc40cd6aa3b2656858'
//       }
//     }
// })

const submitFrame = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const {
    frameSequenceName,
    currentStepOfSequence,
    buttonClicked
  } = frameSubmissionHelpers(req)

  let nextStep = currentStepOfSequence + 1

  if (
    frameSequenceName === 'initial' &&
    (currentStepOfSequence === 1 || currentStepOfSequence === 3) &&
    buttonClicked !== 'More'
  ) {
    nextStep = currentStepOfSequence + 2
  }

  if (
    frameSequenceName === 'personalValues' &&
    (currentStepOfSequence === 1 || currentStepOfSequence === 3) &&
    buttonClicked !== 'Next'
  ) {
    nextStep = currentStepOfSequence + 2
  }

  if (
    frameSequenceName === 'lifeStyle' &&
    (currentStepOfSequence === 1 || currentStepOfSequence === 3) &&
    buttonClicked !== 'More'
  ) {
    nextStep = currentStepOfSequence + 2
  }

  res.redirect(
    307,
    `/frames/sequence/${frameSequenceName}?step=${nextStep}`
  )
}

export default submitFrame
