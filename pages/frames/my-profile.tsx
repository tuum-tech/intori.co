import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FarcasterFrameHead } from '../../components/farcaster-frames/FarcasterFrameHead'
import { PageWrapper } from '../../components/farcaster-frames/PageWrapper'
 
type Props = {
  currentStep: number
  imageUrl: string
  postUrl: string
}
 
export const getServerSideProps = (async (context) => {
  const currentStep = parseInt(context.query.step as string, 10) || 0
  const imageUrl = process.env.NEXTAUTH_URL + '/assets/img-step-1.png'
  const postUrl = `${process.env.NEXTAUTH_URL}/frames/initial?id=${Date.now()}&step=${currentStep + 1}`

  return {
    props: {
      currentStep: currentStep,
      imageUrl,
      postUrl
    }
  }
}) satisfies GetServerSideProps<Props>
 
export default function Page({
  currentStep,
  imageUrl,
  postUrl
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!currentStep) {
    return (
      <PageWrapper title="Continuous profile building experience">
        <FarcasterFrameHead title="Intori" imgUrl={imageUrl}>
          <meta name="fc:frame:post_url" content={postUrl} />
          <meta name="fc:frame:button:1" content="Go!" />

          <meta name="fc:frame:button:2" content="Learn More" />
          <meta name="fc:frame:button:2:action" content="link" />
          <meta name="fc:frame:button:2:target" content="https://www.intori.co/" />
        </FarcasterFrameHead>

        <form method="POST" action={postUrl}>
          <p>Sorry, but right now this form is only accessible on Warpcast and Farcaster clients.</p>
        </form>
      </PageWrapper>
    )
  }

  if (currentStep === 1) {
    return (
      <PageWrapper title="Professional Experience">
        <FarcasterFrameHead title="Professional Experience" imgUrl={imageUrl}>
          <meta name="fc:frame:post_url" content={postUrl} />
          <meta name="fc:frame:button:1" content="Employed" />
          <meta name="fc:frame:button:2" content="Self-employed" />
          <meta name="fc:frame:button:3" content="Freelancer" />
          <meta name="fc:frame:button:4" content="More" /> {/* TODO: add 'more' check */}
        </FarcasterFrameHead>
        <form method="POST" action={postUrl}>
          <p>Sorry, but right now this form is only accessible on Warpcast and Farcaster clients.</p>
        </form>
      </PageWrapper>
    )
  }

  if (currentStep === 2) {
    return (
      <PageWrapper title="Professional Experience">
        <FarcasterFrameHead title="Professional Experience" imgUrl={imageUrl}>
          <meta name="fc:frame:post_url" content={postUrl} />
          <meta name="fc:frame:button:1" content="Student" />
          <meta name="fc:frame:button:2" content="Retired" />
          <meta name="fc:frame:button:3" content="Job Seeking" />
          <meta name="fc:frame:button:4" content="Other" />
        </FarcasterFrameHead>
        <form method="POST" action={postUrl}>
          <p>Sorry, but right now this form is only accessible on Warpcast and Farcaster clients.</p>
        </form>
      </PageWrapper>
    )
  }

  if (currentStep === 3) {
    return (
      <PageWrapper title="Skills and Endorsements">
        <FarcasterFrameHead title="Skills and Endorsements" imgUrl={imageUrl}>
          <meta name="fc:frame:post_url" content={postUrl} />
          <meta name="fc:frame:button:1" content="Programming" />
          <meta name="fc:frame:button:2" content="Design" />
          <meta name="fc:frame:button:3" content="Management" />
          <meta name="fc:frame:button:4" content="More" />
        </FarcasterFrameHead>
        <form method="POST" action={postUrl}>
          <p>Sorry, but right now this form is only accessible on Warpcast and Farcaster clients.</p>
        </form>
      </PageWrapper>
    )
  }

  if (currentStep === 4) {
    return (
      <PageWrapper title="Skills and Endorsements">
        <FarcasterFrameHead title="Skills and Endorsements" imgUrl={imageUrl}>
          <meta name="fc:frame:post_url" content={postUrl} />
          <meta name="fc:frame:button:1" content="Sales" />
          <meta name="fc:frame:button:2" content="Marketing" />
          <meta name="fc:frame:button:3" content="Education" />
          <meta name="fc:frame:button:4" content="Other" />
        </FarcasterFrameHead>
        <form method="POST" action={postUrl}>
          <p>Sorry, but right now this form is only accessible on Warpcast and Farcaster clients.</p>
        </form>
      </PageWrapper>
    )
  }

  if (currentStep === 5) {
    return (
      <PageWrapper title="Congrats – Your profile is growing!">
        <FarcasterFrameHead title="Congrats – Your profile is growing!" imgUrl={imageUrl}>
          <meta name="fc:frame:post_url" content={postUrl} />
          <meta name="fc:frame:button:2" content="View Profile" />
          <meta name="fc:frame:button:2:action" content="link" />
          <meta name="fc:frame:button:2:target" content="https://www.intori.co/" />

          <meta name="fc:frame:button:1" content="Share" />
        </FarcasterFrameHead>
        <form method="POST" action={postUrl}>
          <p>Sorry, but right now this form is only accessible on Warpcast and Farcaster clients.</p>
        </form>
      </PageWrapper>
    )
  }
}
