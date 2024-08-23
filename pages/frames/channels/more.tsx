import React, { useState } from 'react'
import { toast } from 'react-toastify'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../../components/farcaster/FrameGenerator'
import { AppLayout } from "../../../layouts/App"
import { Section } from '../../../components/common/Section'
import {
    IntoriFrameType,
    IntoriFrameInputType
} from '../../../utils/frames/intoriFrameForms'
import Input from '../../../components/common/Input'
import { PrimaryButton } from '../../../components/common/Button'
import { getAllChannelFrames } from '../../../models/channelFrames'
import {
  paginateInputs
} from '../../../utils/frames/paginateInputs'
import {
  createCheckoutTheseChannelsUrl
} from '../../../utils/frames/generatePageUrls'
import styles from '../FramePage.module.css'

type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/channels/more`
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/frames/channels/more?v=${Math.random()}`

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
  const [copyButtonText, setCopyButtonText] = useState('Copy Frame Link')

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(frameUrl)
    toast.success('Frame link copied to clipboard 😎')
    setCopyButtonText('Copied!')
    setTimeout(() => {
      setCopyButtonText('Copy Frame Link')
    }, 2000)
  }

  return (
    <>
      <FrameGenerator
        frame={frame}
        imageUrl={imageUrl}
        frameUrl={frameUrl}
        frameImageAspectRatio="1:1"
      />
      <AppLayout>
        <Section>
          <div className={styles.shareFrameContainer}>
            <div className="text-center">
              <h1>Your data, connected.</h1>

              <div className={styles.inputContainer}>
                <Input
                  label="Share this frame with others and gain points!"
                  value={frameUrl}
                  onChange={console.log}
                  placeholder="Frame URL"
                  onClick={copyUrlToClipboard}
                  readOnly
                />
                <PrimaryButton onClick={copyUrlToClipboard}>
                  {copyButtonText}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </Section>
      </AppLayout>
    </>
  )
}
