import type { NextApiRequest, NextApiResponse } from 'next'
import {
  frameSubmissionHelpers
} from '../../../utils/frames/frameSubmissionHelpers'
import { validateFarcasterPacketMessage } from '../utils/farcasterServer'
import {
  createUserAnswer,
  getUserAnswerForQuestion
} from '../../../models/userAnswers'
import { intoriQuestions } from '../../../utils/frames/intoriFrameForms'

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

  const validFarcasterPacket = await validateFarcasterPacketMessage(req.body)

  if (!validFarcasterPacket) {
    // TODO: show error frame
    return res.status(400).end()
  }

  const {
    fid,
    buttonClicked,
    question,
    fidThatCastedFrame,
    step,
    referrer
  } = frameSubmissionHelpers(req)

  const nextStep = step + 1

  if (!step && !referrer.endsWith('/frames/sequence/begin')) {
    return res.status(400).end()
  }

  if ([0, 2, 4].includes(step)) {
    let questionIndex = Math.floor(Math.random() * intoriQuestions.length)
    let question = intoriQuestions[questionIndex]
    let alreadyAnswered = await getUserAnswerForQuestion(fid, question.question)

    while (alreadyAnswered) {
      questionIndex = Math.floor(Math.random() * intoriQuestions.length)
      question = intoriQuestions[questionIndex]
      alreadyAnswered = await getUserAnswerForQuestion(fid, question.question)
    }

    return res.redirect(
      307,
      `/frames/sequence/question?qi=${questionIndex}&step=${nextStep}`
    )
  }

  // check if user already answered this question
  if ([1, 3, 5].includes(step) && question && buttonClicked) {
    const alreadyAnswered = await getUserAnswerForQuestion(fid, question.question)

    if (alreadyAnswered) {
      return res.status(400).end()
    }

    await createUserAnswer({
      fid,
      question: question.question,
      answer: buttonClicked,
      casterFid: fidThatCastedFrame
    })

    const questionIndex = intoriQuestions.findIndex(
      (q) => q.question === question.question
    )

    return res.redirect(
      307,
      `/frames/sequence/results?step=${nextStep}&qi=${questionIndex}&fid=${fid}`
    )
  }

  return res.status(400).end()
}

export default submitFrame
