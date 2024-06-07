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

  const inputs: IntoriFrameInputType[] = []

  // TODO: get suggested channel
  inputs.push({
    type: 'button',
    action: 'link',
    target: 'https://warpcast.com/~/channel/farcaster',
    content: '/farcaster',
  })

  if (session?.questionNumber === 3) {
    // TODO: get suggested user
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

  if (session.questionNumber < 3) {
    inputs.push({
        type: 'button',
        content: 'Keep Going >',
        postUrl: `${process.env.NEXTAUTH_URL}/api/frames/question`
    })
  }

  const frame: IntoriFrameType = {
    inputs
  }

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
