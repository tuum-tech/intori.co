import React, { useState } from 'react'
import { toast } from 'react-toastify'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import { IntoriFrameType } from '../../utils/frames/intoriFrameForms'
import { getAvailableQuestions } from '../../utils/frames/questions'
import {
  getFrameInputsBasedOnAnswerOffset
} from '../../utils/frames/frameSubmissionHelpers'
import Input from '../../components/common/Input'
import { PrimaryButton } from '../../components/common/Button'
import styles from './FramePage.module.css'
import { createFrameErrorUrl } from '../../utils/frames/generatePageUrls'
import { getFrameSessionById } from '../../models/frameSession'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  if (!context?.query?.qi || !context?.query?.fsid) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const questionIndex = parseInt(context.query.qi as string, 10)
  const answerOffset = parseInt(context.query.ioff as string, 10) || 0
  const frameSessionId = context.query.fsid?.toString() as string
  const session = await getFrameSessionById(frameSessionId)
  const availableQuestions = getAvailableQuestions({ channelId: session?.channelId })
  const question = availableQuestions[questionIndex]

  if (!question || !session) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/begin`
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/frames/questions/${questionIndex}.png`

  const frame: IntoriFrameType = {
    question: question.question,
    inputs: getFrameInputsBasedOnAnswerOffset(
      questionIndex,
      answerOffset,
      session
    )
  }

  return {
    props: {
      imageUrl,
      frameUrl,
      frame: frame as IntoriFrameType
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
        frameImageAspectRatio='1:1'
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
