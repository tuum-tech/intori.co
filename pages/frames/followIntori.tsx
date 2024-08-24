import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType,
    IntoriFrameInputType
} from '../../utils/frames/intoriFrameForms'
import { createNextRevealUrl } from '../../utils/urls'
import {
  getFrameSessionById
} from '../../models/frameSession'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  if (!context?.query.fsid) {
    return {
      redirect: {
        destination: '/frames/error',
        permanent: false
      }
    }
  }

  const frameSessionId = context.query.fsid?.toString() as string

  const session = await getFrameSessionById(frameSessionId)

  if (!session) {
    return {
      redirect: {
        destination: '/frames/error',
        permanent: false
      }
    }
  }
  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/begin`
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/templates/follow_required.png`

  const inputs: IntoriFrameInputType[] = []

  inputs.push({
    type: 'button',
    action: 'link',
    target: `https://warpcast.com/intori`,
    content: '@intori'
  })

  inputs.push({
    type: 'button',
    postUrl: createNextRevealUrl({ fsid: session.id }),
    content: '✨ Reveal'
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
