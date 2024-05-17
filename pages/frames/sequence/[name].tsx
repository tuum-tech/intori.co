import React, { useState, useMemo, useCallback } from 'react'
import { toast } from 'react-toastify'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FarcasterFrameHead } from '../../../components/farcaster-frames/FarcasterFrameHead'
import { PageWrapper } from '../../../components/farcaster-frames/PageWrapper'
import {
    intoriFrameForms,
    IntoriFrameFormType,
    IntoriFrameStepInputType,
    introductionStep,
    finalStep
} from '../../../utils/frames/intoriFrameForms'
import { camelCaseToTitleCase } from '../../../utils/textHelpers'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import {
  getSuggestedUsersAndChannels,
} from '../../../models/userAnswers'
import { FarcasterChannelType, FarcasterUserType } from '../../../utils/neynarApi'
 
type Props = {
  currentStep: number
  postUrl: string
  intoriFrameForm: IntoriFrameFormType
  imageUrl: string
  frameUrl: string
  suggestedChannel?: FarcasterChannelType
  suggestedUser?: FarcasterUserType
}
 
export const getServerSideProps = (async (context) => {
  if (!context?.params?.name) {
    return {
      notFound: true
    }
  }

  const intoriSequence = intoriFrameForms[context.params.name as string]

  if (!intoriSequence) {
    return {
      notFound: true
    }
  }

  const currentStep = parseInt(context.query.step as string, 10) || 0
  const isLastStep = currentStep ? !intoriSequence.steps[currentStep - 1] : false

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/sequence/${intoriSequence.name}`
  const postUrl = `${process.env.NEXTAUTH_URL}/api/frames/submit?step=${currentStep}`

  console.log({ isLastStep })

  if (isLastStep) {
    const fid = parseInt(context.query.fid as string, 10) || 0

    if (!fid) {
      return {
        notFound: true
      }
    }

    const imageUrl = `${process.env.NEXTAUTH_URL}/api/profile/${fid}?t=${Date.now()}`

    const {
      suggestedChannels,
      suggestedUsers
    } = await getSuggestedUsersAndChannels(fid)

    console.log({
      suggestedUsers,
      suggestedChannels
    })

    return {
      props: {
        currentStep: currentStep,
        postUrl,
        intoriFrameForm: intoriSequence,
        imageUrl,
        frameUrl,
        suggestedChannel: suggestedChannels[Math.floor(Math.random() * suggestedChannels.length)],
        suggestedUser: suggestedUsers[Math.floor(Math.random() * suggestedUsers.length)]
      }
    }
  }

  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/frames/${intoriSequence.name}/${currentStep + 1}.png`

  return {
    props: {
      currentStep: currentStep,
      postUrl,
      intoriFrameForm: intoriSequence,
      imageUrl,
      frameUrl
    }
  }
}) satisfies GetServerSideProps<Props>
 
export default function Page({
  currentStep,
  postUrl,
  intoriFrameForm,
  imageUrl,
  frameUrl,
  suggestedChannel,
  suggestedUser
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [copyButtonText, setCopyButtonText] = useState('Copy Frame Link')

  const thisStep = useMemo(() => {
      if (!currentStep) {
          return introductionStep
      }

      if (intoriFrameForm.steps[currentStep - 1]) {
        return intoriFrameForm.steps[currentStep - 1]
      }

      if (!suggestedChannel || !suggestedUser) {
        return finalStep
      }


      // the suggested user
      finalStep.inputs[0].action = 'link'
      finalStep.inputs[0].target = `https://warpcast.com/${suggestedUser.username}`
      finalStep.inputs[0].content = `@${suggestedUser.username}`

      // the suggested channel
      finalStep.inputs[1].action = 'link'
      finalStep.inputs[1].target = suggestedChannel.url
      finalStep.inputs[1].content = `/${suggestedChannel.name}`

      return finalStep
  }, [currentStep, intoriFrameForm, suggestedChannel, suggestedUser])

  const getTarget = useCallback((input: IntoriFrameStepInputType) => {
    if (input.content === 'Share Frame') {
      return frameUrl
    }

    return input.target
  }, [frameUrl])

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(frameUrl)
    toast.success('Frame link copied to clipboard 😎')
    setCopyButtonText('Copied!')
    setTimeout(() => {
      setCopyButtonText('Copy Frame Link')
    }, 2000)
  }

  return (
    <PageWrapper title={thisStep.title}>
      <FarcasterFrameHead
        title={thisStep.title}
        imgUrl={imageUrl}
        description={thisStep.question || 'Your data, connected.'}
      >
        <meta name="fc:frame:post_url" content={postUrl} />

        {
          thisStep.inputs.map((button, index) => (
            <React.Fragment key={button.content}>
              <meta
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
            </React.Fragment>
          ))
        }
      </FarcasterFrameHead>

      <form method="POST" action={postUrl}>
        <div className="text-center">
          <h1>{camelCaseToTitleCase(intoriFrameForm.name)}</h1>

          <div className="w-80 mx-auto mb-8 flex flex-col flex-wrap gap-[18px] justify-center">
            <Input
              label="Share this frame with others and gain points!"
              value={frameUrl}
              onChange={console.log}
              placeholder="Frame URL"
            />
            <Button title={copyButtonText} onClick={copyUrlToClipboard} />
          </div>
        </div>
      </form>
    </PageWrapper>
  )
}
