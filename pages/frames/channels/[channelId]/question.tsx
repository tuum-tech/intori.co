import React, { useState } from 'react'
import { toast } from 'react-toastify'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../../../components/farcaster/FrameGenerator'
import { AppLayout } from "../../../../layouts/App"
import { Section } from '../../../../components/common/Section'
import {
    IntoriFrameType,
    createIntroductionStep
} from '../../../../utils/frames/intoriFrameForms'
import Input from '../../../../components/common/Input'
import { PrimaryButton } from '../../../../components/common/Button'
import styles from '../../FramePage.module.css'

// TODO: get channelId param and expect questionId query. ( qid )
// check if question by question id exists
// create image url that will include question text and channel branding
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  const channelId = context.params?.channelId?.toString()
  const questionId = context.query.qid?.toString()

  if (!channelId || !questionId) {
    return {
      notFound: true
    }
  }

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/channels/${channelId}`

  // TODO: image will be of the question, but white labed for channel. Should point to an api handler
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/frames/channels/${channelId}/images/question?qid=${questionId}`

  return {
    props: {
      imageUrl,
      frameUrl,
      frame: createIntroductionStep({ channelId })
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
