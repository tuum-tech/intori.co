import React, { useState } from 'react'
import { toast } from 'react-toastify'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../../components/farcaster/FrameGenerator'
import { AppLayout } from "@/layouts/App"
import { Section } from '../../../components/common/Section'
import {
    IntoriFrameType,
    intoriQuestions,
    IntoriFrameInputType
} from '../../../utils/frames/intoriFrameForms'
import Input from '../../../components/common/Input'
import { PrimaryButton } from '../../../components/common/Button'
import styles from './FramePage.module.css'
 
type Props = {
  postUrl: string
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  if (!context?.params?.qi) {
    return {
      notFound: true
    }
  }

  const questionIndex = parseInt(context.query.qi as string, 10)
  const step = parseInt(context.query.step as string, 10) || 0
  const fid = parseInt(context.query.fid as string, 10) || 0
  const question = intoriQuestions[questionIndex]

  if (!question || !step || !fid) {
    return {
      notFound: true
    }
  }

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/sequence/begin`
  const postUrl = `${process.env.NEXTAUTH_URL}/api/frames/submit?step=${step}`
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/frames/profile/${fid}`

  // if step == 5, show suggested user
  // suggest a channel
  // share frame 
  // view intori.co
  const inputs: IntoriFrameInputType[] = []

  // get suggested channel
  inputs.push({
    type: 'button',
    action: 'link',
    target: 'https://warpcast.com/~/channel/farcaster',
    content: '/farcaster',
  })

  if (step === 6) {
    inputs.push({
      type: 'button',
      action: 'link',
      target: 'https://warpcast.com/intori',
      content: '/intori',
    })
  }

  inputs.push({
      type: 'button',
      action: 'link',
      target: frameUrl,
      content: 'Share Frame'
  })

  const frame: IntoriFrameType = {
    inputs
  }

  return {
    props: {
      postUrl,
      imageUrl,
      frameUrl,
      frame
    }
  }
}) satisfies GetServerSideProps<Props>
 
export default function Page({
  postUrl,
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
        postUrl={postUrl}
        frameUrl={frameUrl}
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
