import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType
} from '../../utils/frames/intoriFrameForms'
import { createOnboardActivateUrl } from '../../utils/urls'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async () => {
  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/onboard`
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/frames/onboard-start.png`

  return {
    props: {
      imageUrl,
      frameUrl,
      frame: {
        inputs: [
          {
            type: 'button',
            content: 'Activate',
            postUrl: createOnboardActivateUrl()
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
