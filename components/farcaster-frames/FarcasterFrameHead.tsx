import React from 'react'
import Head from 'next/head'

type Props = {
  title: string
  imgUrl: string
  children?: React.ReactNode
}

export const FarcasterFrameHead: React.FC<Props> = ({
  title,
  imgUrl,
  children
}) => {
    return (
      <Head>
        <meta charSet="utf-8"/>
        <title>{title}</title>

        <meta property="og:title" content={title} />
        <meta property="og:image" content={imgUrl} />

        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={imgUrl} />
        <meta property="fc:frame:image:aspect_ratio" content="1.5:1" />
        { children }
      </Head>
    )
}

