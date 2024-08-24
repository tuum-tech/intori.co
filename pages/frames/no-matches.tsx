import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType,
    IntoriFrameInputType
} from '../../utils/frames/intoriFrameForms'
import { getFrameSessionById } from '../../models/frameSession'
import { createStartNewFrameQuestionUrl, createFrameErrorUrl } from '../../utils/urls'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  if (!context?.query.fsid) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const frameSessionId = context.query.fsid?.toString() as string

  const session = await getFrameSessionById(frameSessionId)

  if (!session) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/begin`
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/templates/no_matches.png`

  const inputs: IntoriFrameInputType[] = []

  inputs.push({
    type: 'button',
    postUrl: createStartNewFrameQuestionUrl({ frameSessionId }),
    content: 'Keep Going'
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
      frameImageAspectRatio="1.91:1"
    />
  )
}
