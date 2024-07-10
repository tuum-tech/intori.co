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
import { getSuggestedUser } from '../../utils/frames/suggestions'
import { createNextRevealUrl } from '../../utils/frames/generatePageUrls'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
export const getServerSideProps = (async (context) => {
  if (!context?.query.fsid) {
    return {
      redirect: {
        destination: '/frames/error',
        permanent: false
      }
    }
  }

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
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/results/${session.id}`
  const imageUrlQueryParts: string[] = []

  const inputs: IntoriFrameInputType[] = []

  inputs.push({
      type: 'button',
      action: 'link',
      target: frameUrl,
      content: 'Share Frame'
  })

  inputs.push({
      type: 'button',
      action: 'link',
      target: 'https://www.intori.co/',
      content: 'Learn More'
  })

  const userSuggestion = await getSuggestedUser(session)

  inputs.push({
    type: 'button',
    action: 'link',
    target: `https://warpcast.com/${userSuggestion.user}`,
    content: `@${userSuggestion.user}`
  })

  inputs.push({
    type: 'button',
    postUrl: createNextRevealUrl({ fsid: session.id }),
    content: '✨Reveal'
  })

  // todo: pass suggested fid
  imageUrlQueryParts.push(`su=${userSuggestion.fid}`)
  imageUrlQueryParts.push(`sur=${userSuggestion.reason}`)

  // if (session.questionNumber < 3) {
  //   inputs.push({
  //       type: 'button',
  //       action: 'link',
  //       target: 'https://www.intori.co/',
  //       content: 'Learn More'
  //   })

  //   inputs.push({
  //       type: 'button',
  //       content: 'Keep Going >',
  //       postUrl: createStartNewFrameQuestionUrl({ frameSessionId }),
  //   })
  // }

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
