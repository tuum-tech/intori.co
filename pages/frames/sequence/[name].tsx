import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { FarcasterFrameHead } from '../../../components/farcaster-frames/FarcasterFrameHead'
import { PageWrapper } from '../../../components/farcaster-frames/PageWrapper'
import { intoriFrameForms, IntoriFrameFormType } from '../../../utils/frames/intoriFrameForms'
 
type Props = {
  currentStep: number
  postUrl: string
  intoriFrameForm: IntoriFrameFormType
}
 
export const getServerSideProps = (async (context) => {
  console.log('name: ', context?.params?.name)
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

  return {
    props: {
      currentStep: currentStep,
      postUrl,
      intoriFrameForm: intoriSequence
    }
  }
}) satisfies GetServerSideProps<Props>
 
export default function Page({
  currentStep,
  postUrl,
  intoriFrameForm
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const title = intoriFrameForm.steps[currentStep].title
  const imageUrl = intoriFrameForm.steps[currentStep].imageUrl
  const inputs = intoriFrameForm.steps[currentStep].inputs

  return (
    <PageWrapper title={title}>
      <FarcasterFrameHead title="Intori" imgUrl={imageUrl}>
        <meta name="fc:frame:post_url" content={postUrl} />

        {
          inputs.map((button, index) => (
            <React.Fragment key={button.content}>
              <meta name={`fc:frame:button:${index}`} content={button.content} />
              { button.action === 'link' && (
                <>
                  <meta
                    name={`fc:frame:button:${index}:action`}
                    content="link"
                  />
                  <meta
                    name={`fc:frame:button:${index}:target`}
                    content={button.target}
                  />
                </>
              )}
            </React.Fragment>
          ))
        }
        <meta name="fc:frame:button:1" content="Go!" />
        <meta name="fc:frame:button:2" content="Learn More" />
        <meta name="fc:frame:button:2:action" content="link" />
        <meta name="fc:frame:button:2:target" content="https://www.intori.co/" />
      </FarcasterFrameHead>

      <div className="text-center">
        <p>Sorry, this form is only accessible on Farcaster clients.</p>
      </div>
    </PageWrapper>
  )
}
