import React, { useState } from 'react'
import { toast } from 'react-toastify'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import {
    IntoriFrameType,
    IntoriFrameInputType
} from '../../utils/frames/intoriFrameForms'
import Input from '../../components/common/Input'
import { PrimaryButton } from '../../components/common/Button'
import styles from './FramePage.module.css'
import {
  createFrameErrorUrl,
  createStartNewFrameQuestionUrl
} from '../../utils/frames/generatePageUrls'
import { getFrameSessionById, updateTutorialNoLongerNeeded } from '../../models/frameSession'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/tutorial`
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/frames/tutorial_frame.gif`

  if (!context?.query.fsid) {
    console.log('no fsid for tutorial frame')
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const frameSessionId = context.query.fsid?.toString() as string

  console.log('about to get sessoin')
  const session = await getFrameSessionById(frameSessionId)
  console.log('got session:', session)

  if (!session) {
    console.log('no session for tutorial frame')
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  console.log('here')
  await updateTutorialNoLongerNeeded(frameSessionId)

  const inputs: IntoriFrameInputType[] = []

  inputs.push({
    content: 'Got it!',
    type: 'button',
    postUrl: createStartNewFrameQuestionUrl({
      frameSessionId: session.id
    }),
  })

  const frame: IntoriFrameType = {
    inputs
  }
  console.log('showing tutorial frame:', frame)

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
