import { createStartNewFrameQuestionUrl } from './generatePageUrls'

export type IntoriFrameInputType = {
    type: 'button'
    content: string
    action?: 'link'
    target?: string
    postUrl?: string // A 256-byte string that defines a button-specific URL to send the Signature Packet to. If set, this overrides fc:frame:post_url.
}

export type IntoriFrameType = {
  question?: string
  inputs: IntoriFrameInputType[]
}

export const createIntroductionStep = (params: {
  channelId?: string
} = {}): IntoriFrameType => {
  return {
    inputs: [
      {
        type: 'button',
        content: 'Learn More',
        action: 'link',
        target: 'https://www.intori.co/'
      },
      {
        type: 'button',
        content: '🌟 Discover',
        postUrl: createStartNewFrameQuestionUrl(params)
      }
    ]
  }
}

export const errorFrame: IntoriFrameType = {
    inputs: [
      {
        type: 'button',
        content: 'Try Again',
        postUrl: createStartNewFrameQuestionUrl()
      }
    ]
}

const urlSafeText = encodeURIComponent('Check out this frame from Intori!')

export const getShareFrameCastIntent = (): string => {
  const shareFrameUrlSafeText = encodeURIComponent(process.env.NEXTAUTH_URL + '/frames/begin')
  return `https://warpcast.com/~/compose?text=${urlSafeText}&embeds[]=${shareFrameUrlSafeText}`
}

export const finalStep: IntoriFrameType = {
    inputs: [
      {
        type: 'button',
        content: 'Suggested Follows'
      },
      {
        type: 'button',
        content: 'Suggested Channel'
      },
      {
        type: 'button',
        action: 'link',
        target: getShareFrameCastIntent(),
        content: 'Share Frame'
      },
      {
        type: 'button',
        action: 'link',
        target: 'https://www.intori.co/',
        content: 'View intori.co'
      },
    ]
}
