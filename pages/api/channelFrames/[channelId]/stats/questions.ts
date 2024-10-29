// get list of unique questions 
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]'
import {
  getAllUserResponses,
  countUserAnswersForQuestion
} from '../../../../../models/userAnswers'
import {
  getQuestionByQuestionText
} from '../../../../../models/questions'
import {
  getChannelFrame
} from '../../../../../models/channelFrames'
import { allowedToEditChannel } from '../../../../../utils/canEditChannel'
import { isUserMemberOfChannel } from '../../../../../utils/warpcast'

type Response = {
  question: string
  questionId: string
  totalResponses: number
  memberFids: number[]
  nonMemberFids: number[]
  responseTotals: {
    answer: string
    count: number
  }[]
}

const getUniqueChannelQuestions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions(req))

  if (!session) {
    return res.status(403).end()
  }

  const fid = parseInt(session.user.fid, 10)
  const channelId = req.query.channelId as string

  const channel = await getChannelFrame(channelId)

  if (!channel) {
    return res.status(404).end()
  }

  const canViewStats = await allowedToEditChannel(fid, channel)

  if (!canViewStats) {
    return res.status(403).end()
  }

  const allResponsesInChannel = await getAllUserResponses({ channelId })
  const uniqueQuestions = Array.from(new Set(allResponsesInChannel.map(response => response.question)))

  const responseData: Response[] = []
  for (let i = 0; i < uniqueQuestions.length; i++) {
    const question = await getQuestionByQuestionText(uniqueQuestions[i])

    if (!question) {
      continue
    }

    const responseTotals = await countUserAnswersForQuestion(question.question, { channelId })
    const fids = Array.from(new Set(
      allResponsesInChannel
        .filter(response => response.question === question.question)
        .map(response => response.fid)
    ))

    const memberFids: number[] = []
    const nonMemberFids: number[] = []

    await Promise.all(fids.map(async fid => {
      const isMember = await isUserMemberOfChannel({ fid, channelId })

      if (isMember) {
        memberFids.push(fid)
      } else {
        nonMemberFids.push(fid)
      }
    }))

    memberFids.sort((a, b) => a - b)
    nonMemberFids.sort((a, b) => a - b)

    responseData.push({
      question: question.question,
      questionId: question.id,
      memberFids,
      nonMemberFids,
      totalResponses: responseTotals.reduce((acc, curr) => acc + curr.count, 0),
      responseTotals,
    })
  }

  return res.status(200).json(responseData)
}

export default getUniqueChannelQuestions
