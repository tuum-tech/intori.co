import React, { useMemo } from 'react'

export const FramesV2EmbedMetaTags: React.FC = () => {

  const frameEmbed = useMemo(() => {
    const host = process.env.NEXTAUTH_URL ?? window.location.origin

    return {
      version: 'next',
      imageUrl: `${host}/assets/fc-app/metaImageUrl.png`,
      button: {
        // Button text.
        // Max length of 32 characters.
        title: 'Start Connecting',

        // Action attributes
        action: {
          // Action type. Must be "launch_frame".
          type: 'launch_frame',

          // App name
          // Max length of 32 characters.
          // Example: "Yoink!"
          name: 'intori',

          // Frame launch URL.
          // Max 512 characters.
          url: `${host}/fc-app/start`,

          // Splash image URL.
          // Max 512 characters.
          // Image must be 200x200px and less than 1MB.
          splashImageUrl: `${host}/assets/fc-app/metaSplashImageUrl.png`,

          // Hex color code.
          splashBackgroundColor: '#A388ED'
        }
      }
    }
  }, [])

  return (
    <>
      <meta name="fc:frame" content={JSON.stringify(frameEmbed)} />
    </>
  )
}

