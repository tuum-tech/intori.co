import React from 'react'
import Head from 'next/head'

type Props = {
  imgUrl: string
  description: string
  children?: React.ReactNode
  frameImageAspectRatio?:  '1.91:1' | '1:1'
}

export const FarcasterFrameHead: React.FC<Props> = ({
  imgUrl,
  description,
  children,
  frameImageAspectRatio
}) => {
    return (
      <Head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Intori – Your data, connected.</title>
        <meta name="description" content={description} />

        <meta property="og:title" content="Intori – Your data, connected." />
        <meta property="og:image" content={imgUrl} />

        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={imgUrl} />
        <meta property="fc:frame:image:aspect_ratio" content={frameImageAspectRatio ?? "1.91:1"} />
        { children }
      </Head>
    )
}

