import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType,
    IntoriFrameInputType
} from '../../utils/frames/intoriFrameForms'
import {
  createFrameErrorUrl,
  createStartNewFrameQuestionUrl
} from '../../utils/urls'
import { getFrameSessionById, updateTutorialNoLongerNeeded } from '../../models/frameSession'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/tutorial`
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/frames/tutorial_frame.gif`

  if (!context?.query.fsid) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const frameSessionId = context.query.fsid?.toString() as string
  const questionId = context.query.qi

  const session = await getFrameSessionById(frameSessionId)

  if (!session) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  await updateTutorialNoLongerNeeded(frameSessionId)

  const inputs: IntoriFrameInputType[] = []

  inputs.push({
    content: 'Got it!',
    type: 'button',
    postUrl: createStartNewFrameQuestionUrl({
      frameSessionId: session.id,
      questionId: questionId ? questionId.toString() : undefined
    }),
  })

  const frame: IntoriFrameType = {
    inputs
  }

  return {
    props: {
      imageUrl,
      frameUrl,
      frame
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
      frameImageAspectRatio="1:1"
    />
  )
}
