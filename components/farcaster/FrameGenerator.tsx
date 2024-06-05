import React, { useCallback } from 'react'
import {
  IntoriFrameType,
  IntoriFrameInputType
} from '../../utils/frames/intoriFrameForms'
import {
  FarcasterFrameHead
} from './FarcasterFrameHead'

type Props = {
  frame: IntoriFrameType
  imageUrl: string
  postUrl: string
  frameUrl: string
}

export const FrameGenerator: React.FC<Props> = ({
  frame,
  imageUrl,
  postUrl,
  frameUrl
}) => {
  const getTarget = useCallback((input: IntoriFrameInputType) => {
    if (input.content === 'Share Frame') {
      const urlSafeText = encodeURIComponent(frame?.question || 'Check out this frame from Intori!')
      return `https://warpcast.com/~/compose?text=${urlSafeText}&embeds[]=${frameUrl}`
    }

      return input.target
  }, [frameUrl, frame])

  return (
    <FarcasterFrameHead
      imgUrl={imageUrl}
      description={frame.question || 'Your data, connected.'}
    >
      <meta name="fc:frame:post_url" content={postUrl} />

      {
        frame.inputs.map((button, index) => (
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
  )
}

