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
import { getFrameSessionById } from '../../models/frameSession'
import {
  createStartNewFrameQuestionUrl
} from '../../utils/frames/generatePageUrls'
import {
  getSuggestedChannel,
  getSuggestedUser
} from '../../utils/frames/suggestions'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  if (!context?.query.fid || !context?.query.fsid) {
    return {
      redirect: {
        destination: '/frames/error',
        permanent: false
      }
    }
  }

  const fid = parseInt(context.query.fid as string, 10) || 0
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
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/results/${fid}`
  const imageUrlQueryParts: string[] = []

  const inputs: IntoriFrameInputType[] = []

  const channelSuggestion = await getSuggestedChannel(session)

  inputs.push({
    type: 'button',
    action: 'link',
    target: `https://warpcast.com/~/channel/${channelSuggestion}`,
    content: `/${channelSuggestion}`
  })

  imageUrlQueryParts.push(`sc=${channelSuggestion}`)

  if (session?.questionNumber === 3) {
    const userSuggestion = await getSuggestedUser(session)

    inputs.push({
      type: 'button',
      action: 'link',
      target: `https://warpcast.com/${userSuggestion.user}`,
      content: `@${userSuggestion.user}`
    })

    imageUrlQueryParts.push(`su=${userSuggestion.user}`)
    imageUrlQueryParts.push(`sur=${userSuggestion.reason}`)

    // passing this will show the 'points' text
    imageUrlQueryParts.push(`last=true`)
  }

  inputs.push({
      type: 'button',
      action: 'link',
      target: frameUrl,
      content: 'Share Frame'
  })

  if (session.questionNumber < 3) {
    inputs.push({
        type: 'button',
        action: 'link',
        target: 'https://www.intori.co/',
        content: 'Learn More'
    })

    inputs.push({
        type: 'button',
        content: 'Keep Going >',
        postUrl: createStartNewFrameQuestionUrl({ frameSessionId }),
    })
  }

  const frame: IntoriFrameType = {
    inputs
  }

  return {
    props: {
      imageUrl: imageUrl + '?' + imageUrlQueryParts.join('&'),
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
