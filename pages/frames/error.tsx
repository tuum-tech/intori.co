import React from 'react'
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import { PageWrapper } from '../../components/farcaster/PageWrapper'
import { errorFrame } from '../../utils/frames/intoriFrameForms'
 
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
      <FrameGenerator
        frame={errorFrame}
        imageUrl={imageUrl}
      />

      <div className="text-center">
        <Image src={imageUrl} alt="Profile" width={191 * 3} height={100 * 3} />
      </div>
    </PageWrapper>
  )
}
