import React, { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import {
  IntoriFrameType,
  IntoriFrameInputType
} from '../../utils/frames/intoriFrameForms'
import { AppLayout } from "../../layouts/App"
import { Section } from '../../components/common/Section'
import Input from '../../components/common/Input'
import { PrimaryButton } from '../../components/common/Button'
import {
  FarcasterFrameHead
} from './FarcasterFrameHead'
import styles from './FramePage.module.css'

type Props = {
  frame: IntoriFrameType
  imageUrl: string
  postUrl?: string
  frameUrl: string
  frameImageAspectRatio?:  '1.91:1' | '1:1'
}

export const FrameGenerator: React.FC<Props> = ({
  frame,
  imageUrl,
  postUrl,
  frameUrl,
  frameImageAspectRatio
}) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Frame Link')

  const getTarget = useCallback((input: IntoriFrameInputType) => {
    if (input.content === 'Share Frame' && frameUrl) {
      const urlSafeText = encodeURIComponent(frame?.question || 'Check out this frame from Intori!')
      return `https://warpcast.com/~/compose?text=${urlSafeText}&embeds[]=${frameUrl}`
    }

      return input.target
  }, [frameUrl, frame])


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
      <FarcasterFrameHead
        imgUrl={imageUrl}
        description={frame.question || 'Your data, connected.'}
        frameImageAspectRatio={frameImageAspectRatio}
      >
        { !!postUrl && <meta name="fc:frame:post_url" content={postUrl} /> }

        {
          frame.inputs.map((button, index) => (
            <React.Fragment key={button.content}>
              <meta
                // TODO: update to show input:text
                name={`fc:frame:button:${index + 1}`}
                content={button.content}
              />

              { button.action && (
                <meta
                  name={`fc:frame:button:${index + 1}:action`}
                  content={button.action}
                />
              )}

              { button.target && (
                <meta
                  name={`fc:frame:button:${index + 1}:target`}
                  content={getTarget(button)}
                />
              )}

              {
                button.postUrl && (
                  <meta
                    name={`fc:frame:button:${index + 1}:post_url`}
                    content={button.postUrl}
                  />
                )
              }
            </React.Fragment>
          ))
        }
      </FarcasterFrameHead>
        <AppLayout>
          <Section>
            <div className={styles.shareFrameContainer}>
              <div className="text-center">
                <h1>Your data, connected.</h1>

                <div className={styles.inputContainer}>
                  <Input
                    label="Share this frame on Farcaster with others and gain points!"
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

