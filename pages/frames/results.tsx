import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import {
    IntoriFrameType,
    IntoriFrameInputType
} from '../../utils/frames/intoriFrameForms'
import {
  getFrameSessionById,
  saveSuggestionsToFrameSession,
} from '../../models/frameSession'
import {
  getAllSuggestedUsersAndChannels
} from '../../utils/frames/suggestions'
import {
  createNextRevealUrl,
  createFrameErrorUrl,
  createNoMatchesFoundUrl,
  createCastToChannelUrl
} from '../../utils/urls'
 
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

  if (!session.suggestions.length) {
    const suggestions = await getAllSuggestedUsersAndChannels({
      fid: session.fid,
      channelId: session.channelId,
      limit: 3
    })

    await saveSuggestionsToFrameSession(session.id, suggestions)

    session.suggestions = suggestions
  }

  imageUrlQueryParts.push(`i=${suggestionsRevealed}`)
  const suggestionToShow = session.suggestions[suggestionsRevealed]

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
      rating: -1
    }),
    content: '👎 Not for me'
  })

  inputs.push({
    type: 'button',
    postUrl: createNextRevealUrl({
      fsid: session.id,
      rating: 1
    }),
    content: '👍 Good Match'
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
    target: createCastToChannelUrl({
      channelId: session.channelId,
      userNameToTag: suggestionToShow.user.username,
      reason: suggestionToShow.reason[0]
    }),
    content: 'Say Hi'
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
  return (
    <FrameGenerator
      frame={frame}
      imageUrl={imageUrl}
      frameUrl={frameUrl}
      frameImageAspectRatio="1:1"
    />
  )
}
