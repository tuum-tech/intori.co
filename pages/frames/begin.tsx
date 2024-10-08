import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType
} from '../../utils/frames/intoriFrameForms'
import { createStartNewFrameQuestionUrl } from '../../utils/urls'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async () => {
  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/begin`
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/templates/intro_frame_template.png`

  return {
    props: {
      imageUrl,
      frameUrl,
      frame: {
        inputs: [
          {
            type: 'button',
            content: '🌟 Begin',
            postUrl: createStartNewFrameQuestionUrl()
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
