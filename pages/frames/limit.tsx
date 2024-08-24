import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType,
    IntoriFrameInputType
} from '../../utils/frames/intoriFrameForms'
import { getFrameSessionById } from '../../models/frameSession'
import {
  createFrameResultsUrl,
  createFrameErrorUrl
} from '../../utils/urls'

type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/begin`

  const randomLimitReachedFrameImageIndex = Math.floor(Math.random() * 3) + 1
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/templates/limit_reached_frame_${randomLimitReachedFrameImageIndex}.png`

  const inputs: IntoriFrameInputType[] = []

  inputs.push({
    type: 'button',
    action: 'link',
    target: 'https://www.intori.co/',
    content: 'Learn More'
  })

  const frameSessionId = context.query.fsid?.toString() as string
  if (!frameSessionId) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const session = await getFrameSessionById(frameSessionId)

  if (!session) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  inputs.push({
    type: 'button',
    postUrl: createFrameResultsUrl({ frameSessionId: session.id }),
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
    />
  )
}
