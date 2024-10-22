import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType
} from '../../utils/frames/intoriFrameForms'

type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async () => {
  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/onboard-no-channels`
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/frames/onboard-no-channels.png`

  return {
    props: {
      imageUrl,
      frameUrl,
      frame: {
        inputs: []
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
