import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType,
    IntoriFrameInputType
} from '../../utils/frames/intoriFrameForms'
import {
  getFrameSessionById
} from '../../models/frameSession'
import {
  createFrameErrorUrl,
} from '../../utils/urls'
 
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

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/unlocked-insights`
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/frames/insight?fsid=${session.id}`

  const inputs: IntoriFrameInputType[] = []

  inputs.push({
    type: 'button',
    action: 'link',
    target: 'https://warpcast.com/~/channel/intori',
    content: 'Follow Intori'
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
