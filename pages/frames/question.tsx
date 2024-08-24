import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import { IntoriFrameType } from '../../utils/frames/intoriFrameForms'
import { getQuestionById } from '../../models/questions'
import {
  getFrameInputsBasedOnAnswerOffset
} from '../../utils/frames/frameSubmissionHelpers'
import { createFrameErrorUrl } from '../../utils/urls'
import { getFrameSessionById } from '../../models/frameSession'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  if (!context?.query?.qi || !context?.query?.fsid) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const questionId = (context.query.qi as string).toString()
  const answerOffset = parseInt(context.query.ioff as string ?? '0', 10)
  const frameSessionId = context.query.fsid?.toString() as string
  const session = await getFrameSessionById(frameSessionId)

  if (!session) {
    console.log('session not found.')
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const question = await getQuestionById(questionId.toString())

  if (!question) {
    console.log('question not found.', questionId)
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/begin`

  const imageUrlParts = [
    process.env.NEXTAUTH_URL,
    '/api/frames/channels/',
    session.channelId,
    '/images/question',
    `?qid=${questionId}`,
  ]

  const imageUrl = imageUrlParts.join('')

  const frame: IntoriFrameType = {
    question: question.question,
    inputs: getFrameInputsBasedOnAnswerOffset(
      question,
      answerOffset,
      session
    )
  }

  return {
    props: {
      imageUrl,
      frameUrl,
      frame: frame as IntoriFrameType
    }
  }
}) satisfies GetServerSideProps<Props>
 
export default function Page({
  imageUrl,
  frameUrl,
  frame
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <FrameGenerator
      frame={frame}
      imageUrl={imageUrl}
      frameUrl={frameUrl}
      frameImageAspectRatio='1:1'
    />
  )
}
