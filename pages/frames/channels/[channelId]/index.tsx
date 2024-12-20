import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType
} from '../../../../utils/frames/intoriFrameForms'
import { getChannelFrame } from '../../../../models/channelFrames'
import { createStartNewFrameQuestionUrl } from '../../../../utils/urls'

type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  const channelId = context.params?.channelId?.toString()

  if (!channelId) {
    return {
      notFound: true
    }
  }

  const channelFrame = await getChannelFrame(channelId)
  if (!channelFrame) {
    return {
      notFound: true
    }
  }

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/channels/${channelId}`
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/frames/channels/${channelId}/images/intro?v=2`

  return {
    props: {
      imageUrl,
      frameUrl,
      frame: {
        inputs: [
          {
            type: 'button',
            content: '🌟 Begin',
            postUrl: createStartNewFrameQuestionUrl({
              isIntroFrame: true,
              channelId
            })
          }
        ]
      }
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
