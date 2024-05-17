import React from 'react'
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FarcasterFrameHead } from '../../../components/farcaster-frames/FarcasterFrameHead'
import { PageWrapper } from '../../../components/farcaster-frames/PageWrapper'
 
type Props = {
  imageUrl: string
}
 
export const getServerSideProps = (async (context) => {
  const fid = context?.params?.fid
  if (!fid) {
    return {
      notFound: true
    }
  }

  const imageUrl = `${process.env.NEXTAUTH_URL}/api/profile/${fid}?t=${Date.now()}`

  return {
    props: {
      imageUrl
    }
  }
}) satisfies GetServerSideProps<Props>
 
export default function Page({
  imageUrl
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <PageWrapper title="Profile">
      <FarcasterFrameHead title="Profile" imgUrl={imageUrl} description="Your data, connected.">
          <meta name='fc:frame:button:1' content="Learn More" />
          <meta name='fc:frame:button:1:action' content="link" />
          <meta name='fc:frame:button:1:target' content="https://www.intori.co/" />
      </FarcasterFrameHead>

      <div className="text-center">
        <Image src={imageUrl} alt="Profile" width={191 * 3} height={100 * 3} />
      </div>
    </PageWrapper>
  )
}
