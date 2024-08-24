import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType,
    IntoriFrameInputType
} from '../../../utils/frames/intoriFrameForms'
import { getAllChannelFrames } from '../../../models/channelFrames'
import {
  paginateInputs
} from '../../../utils/frames/paginateInputs'
import {
  createCheckoutTheseChannelsUrl
} from '../../../utils/urls'

type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/channels/more`

  const dailyCacheBust = new Date().toISOString().split('T')[0]
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/frames/channels/more?v=${dailyCacheBust}`

  const allChannelFrames = await getAllChannelFrames()
  const inputOffset = context.query?.ioff ? parseInt(context.query.ioff as string) : 0

  const allChannelInputs: IntoriFrameInputType[] = allChannelFrames.map((channel) => ({
    type: 'button',
    action: 'link',
    content: `/${channel.channelId}`,
    target: `https://warpcast.com/~/channel/${channel.channelId}`
  }))

  const inputs = paginateInputs({
    inputs: allChannelInputs,

    currentInputOffset: inputOffset,

    moreButtonInput: (nextInputOffset) => ({
      type: 'button',
      content: 'More >',
      postUrl: createCheckoutTheseChannelsUrl({ inputOffset: nextInputOffset })
    }),

    backButtonInput: (previousInputOffset) => ({
      type: 'button',
      content: '< Back',
      postUrl: createCheckoutTheseChannelsUrl({ inputOffset: previousInputOffset })
    }),
  })

  return {
    props: {
      imageUrl,
      frameUrl,
      frame: {
        inputs
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
