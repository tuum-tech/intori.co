import React from 'react'
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FrameGenerator } from '../../components/farcaster/FrameGenerator'
import { PageWrapper } from '../../components/farcaster/PageWrapper'
import { errorFrame } from '../../utils/frames/intoriFrameForms'
 
type Props = {
  imageUrl: string
}
 
export const getServerSideProps = (async () => {
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/templates/error_frame.png`

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
