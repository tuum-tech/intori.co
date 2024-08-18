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
  getFrameSessionById,
  saveSuggestionsToFrameSession,
  incrementSuggestionsRevealed
} from '../../models/frameSession'
import {
  getAllSuggestedUsersAndChannels
} from '../../utils/frames/suggestions'
import {
  createNextRevealUrl,
  createFrameErrorUrl,
  createNoMatchesFoundUrl,
  createMessageUserUrl
} from '../../utils/frames/generatePageUrls'
 
type Props = {
  imageUrl: string
  frameUrl: string
  frame: IntoriFrameType
}
 
// TODO:
// New order of suggestions ( show 3 suggestions ):
//         - [x] Channel Power User & Multiple Matching Responses; or
//         - [x] Channel Power User & Matching Response; or
//         - [ ] Multiple Matching Responses; or
//         - [ ] Channel Power User & has used intori; or
//         - [ ] Matching Response & Followed by Power User; or
//         - [x] Channel Power User
export const getServerSideProps = (async (context) => {
  if (!context?.query.fsid) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const frameSessionId = context.query.fsid?.toString() as string

  const session = await getFrameSessionById(frameSessionId)

  if (!session) {
    return {
      redirect: {
        destination: createFrameErrorUrl(),
        permanent: false
      }
    }
  }

  const frameUrl = `${process.env.NEXTAUTH_URL}/frames/begin`
  const imageUrl = `${process.env.NEXTAUTH_URL}/api/results/${session.id}`
  const imageUrlQueryParts: string[] = []

  const inputs: IntoriFrameInputType[] = []

  const suggestionsRevealed = session.suggestionsRevealed ?? 0

  // TODO: need to think about when/if to show this.
  // if (!session.followsIntori) {
  //   const followsIntori = await doesUserFollowIntori(session.fid)

  //   if (!followsIntori) {
  //     return {
  //       redirect: {
  //         destination: createFollowIntoriUrl({ fsid: session.id }),
  //         permanent: false
  //       }
  //     }
  //   }

  //   await saveIfUserFollowsIntori(session.id, followsIntori)
  // }

  // TODO: show only 3 suggestions
  if (!session.suggestions.length) {
    const suggestions = await getAllSuggestedUsersAndChannels({
      fid: session.fid,
      channelId: session.channelId
    })

    await saveSuggestionsToFrameSession(session.id, suggestions)

    session.suggestions = suggestions
  }

  imageUrlQueryParts.push(`i=${suggestionsRevealed}`)
  const suggestionToShow = session.suggestions[suggestionsRevealed % session.suggestions.length]

  incrementSuggestionsRevealed(session.id)

  if (!suggestionToShow?.user) {
    return {
      redirect: {
        destination: createNoMatchesFoundUrl({ fsid: session.id }),
        permanent: false
      }
    }
  }

  inputs.push({
    type: 'button',
    postUrl: createNextRevealUrl({
      fsid: session.id,
      rating: 'bad'
    }),
    content: '❌'
  })

  inputs.push({
    type: 'button',
    postUrl: createNextRevealUrl({
      fsid: session.id,
      rating: 'good'
    }),
    content: '✅'
  })

  inputs.push({
    type: 'button',
    action: 'link',
    target: `https://warpcast.com/${suggestionToShow.user.username}`,
    content: 'Follow'
  })

  inputs.push({
    type: 'button',
    action: 'link',
    target: createMessageUserUrl({
      fid: suggestionToShow.user.fid,
      message: `Hey!\n\nYou were suggested to me by Intori.\n\nWhat's up?`
    }),
    content: 'Message'
  })


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
