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
import { getSuggestedUsersAndChannels } from '../../models/userAnswers'
import {
  createStartNewFrameQuestionUrl
} from '../../utils/frames/generatePageUrls'
 
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

  const suggestions = await getSuggestedUsersAndChannels(fid, {
    maxResults: 5
  })

  const channelSuggestions = suggestions.filter(suggestion => suggestion.channel)
  const userSuggestions = suggestions.filter(suggestion => suggestion.user)

  if (channelSuggestions.length) {
    const randomChannel = channelSuggestions[Math.floor(Math.random() * channelSuggestions.length)]

    inputs.push({
      type: 'button',
      action: 'link',
      target: `https://warpcast.com/~/channel/${randomChannel}`,
      content: `/${randomChannel.channel?.name}`
    })

    imageUrlQueryParts.push(`sc=${randomChannel.channel?.name}`)
    imageUrlQueryParts.push(`scr=${randomChannel.reason}`)
  }

  if (session?.questionNumber === 3) {
    if (!userSuggestions.length) {
      inputs.push({
        type: 'button',
        action: 'link',
        target: 'https://warpcast.com/intori',
        content: '/intori',
      })
    } else {
      const randomUser = userSuggestions[Math.floor(Math.random() * userSuggestions.length)]

      if (randomUser.user) {
        inputs.push({
          type: 'button',
          action: 'link',
          target: `https://warpcast.com/${randomUser.user?.username}`,
          content: `/${randomUser.user?.username}`
        })
      }

      imageUrlQueryParts.push(`su=${randomUser.user?.username}`)
      imageUrlQueryParts.push(`sur=${randomUser.reason}`)
    }
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
        content: 'Keep Going >',
        postUrl: createStartNewFrameQuestionUrl({ frameSessionId }),
    })
  }

  // TODO: add back the learn more intori.co button

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
