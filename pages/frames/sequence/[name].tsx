import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FarcasterFrameHead } from '../../../components/farcaster-frames/FarcasterFrameHead'
import { PageWrapper } from '../../../components/farcaster-frames/PageWrapper'
import { intoriFrameForms, IntoriFrameFormType } from '../../../utils/frames/intoriFrameForms'
 
type Props = {
  currentStep: number
  postUrl: string
  intoriFrameForm: IntoriFrameFormType
  imageUrl: string
}
 
export const getServerSideProps = (async (context) => {
  if (!context?.params?.name) {
    return {
      notFound: true
    }
  }

  const intoriSequence = intoriFrameForms[context.params.name as string]

  if (!intoriSequence) {
    return {
      notFound: true
    }
  }

  const currentStep = parseInt(context.query.step as string, 10) || 0
  const postUrl = `${process.env.NEXTAUTH_URL}/api/frames/submit?step=${currentStep}`
  const imageUrl = `${process.env.NEXTAUTH_URL}/assets/frames/${intoriSequence.name}/${currentStep + 1}.png`

  return {
    props: {
      currentStep: currentStep,
      postUrl,
      intoriFrameForm: intoriSequence,
      imageUrl
    }
  }
}) satisfies GetServerSideProps<Props>
 
export default function Page({
  currentStep,
  postUrl,
  intoriFrameForm,
  imageUrl
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const title = intoriFrameForm.steps[currentStep].title
  const inputs = intoriFrameForm.steps[currentStep].inputs

  return (
    <PageWrapper title={title}>
      <FarcasterFrameHead title="Intori" imgUrl={imageUrl}>
        <meta name="fc:frame:post_url" content={postUrl} />

        {
          inputs.map((button, index) => (
            <React.Fragment key={button.content}>
              <meta name={`fc:frame:button:${index + 1}`} content={button.content} />

              { button.action && (
                  <meta
                    name={`fc:frame:button:${index + 1}:action`}
                    content={button.action}
                  />
              )}

              { button.target && (
                  <meta
                    name={`fc:frame:button:${index + 1}:target`}
                    content={button.target}
                  />
              )}
            </React.Fragment>
          ))
        }
      </FarcasterFrameHead>

      <div className="text-center">
        <p>Sorry, this form is only accessible on Farcaster clients.</p>
      </div>
    </PageWrapper>
  )
}