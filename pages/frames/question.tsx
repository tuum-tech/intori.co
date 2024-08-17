import React, { useState } from 'react'
import { toast } from 'react-toastify'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import { IntoriFrameType } from '../../utils/frames/intoriFrameForms'
import { getQuestionById } from '../../models/questions'
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
  console.log('============================= HERE?')
  if (!context?.query?.qi || !context?.query?.fsid) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  console.log('queries:', context.query)
  const questionId = context.query.qi as string
  const answerOffset = parseInt(context.query.ioff as string ?? '0', 10)
  const frameSessionId = context.query.fsid?.toString() as string
  const session = await getFrameSessionById(frameSessionId)

  console.log('here')

  if (!session) {
    console.log('frame/question – no session.')
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  console.log('about to fetch question')
  const question = await getQuestionById(questionId)

  if (!question) {
    console.log('frame/question – question not found.')
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/begin`

  const imageUrlParts = [
    process.env.NEXTAUTH_URL,
    '/api/frames/channels/',
    session.channelId,
    '/images/question',
    `?qid=${questionId}`,
  ]

  const imageUrl = imageUrlParts.join('')

  console.log('image url:', imageUrl)

  const frame: IntoriFrameType = {
    question: question.question,
    inputs: getFrameInputsBasedOnAnswerOffset(
      question,
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
