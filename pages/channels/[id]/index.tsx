import type { NextPage, GetServerSideProps } from "next";
import * as yup from 'yup'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import { getSession } from "next-auth/react"
import React from 'react'
import { AppLayout } from "@/layouts/App"
import { Section, SubSection, SectionTopActions } from '../../../components/common/Section'
import { ChannelFrameType, getChannelFrame } from '../../../models/channelFrames'
import { QuestionType, getAllQuestions } from '../../../models/questions'
import { ListPotentialMembers } from '../../../components/PotentialMembers'
import { SelectQuestion } from '../../../components/common/SelectQuestion'
import { SelectIntroQuestions } from '../../../components/common/SelectIntroQuestions'
import { PrimaryButton, SecondaryButton } from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import { handleError } from '../../../utils/handleError'

// requests
import  { updateChannelFrame } from '../../../requests/channelFrames'

// stats components
import { GeneralStatsSection } from '../../../components/Stats/GeneralStatsSection'
import { UniqueUsersOverTimeChart } from '../../../components/Stats/UniqueUsersOverTimeChart'
import { MostAnsweredQuestionsChart } from '../../../components/Stats/MostAnsweredQuestionsChart'
import { TopResponsesForTopQuestions } from '../../../components/Stats/TopResponsesForTopQuestions'

// contexts
import { CategoriesProvider } from '../../../contexts/useCategories'

type Props = {
  showSuperAdminTab: boolean
  channelFrame: ChannelFrameType
  allQuestions: QuestionType[]
}

export const getServerSideProps = (async (context) => {
  const session = await getSession(context)

  if (!session?.user?.fid) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  const channelId = context.query.id as string

  const channelFrame = await getChannelFrame(channelId)

  if (!channelFrame) {
    return {
      notFound: true
    }
  }

  if (
    !session.admin &&
    channelFrame.adminFid !== parseInt(session.user.fid, 10)
  ) {
    return {
      notFound: true
    }
  }

  const allQuestions = await getAllQuestions()

  allQuestions.sort((a, b) => {
    return a.question.localeCompare(b.question)
  })

  return {
    props: {
      showSuperAdminTab: !!session.admin,
      allQuestions,
      channelFrame
    }
  }
}) satisfies GetServerSideProps<Props>

const Channel: NextPage<Props> = ({
  allQuestions,
  channelFrame
}) => {
  const formik = useFormik({
    initialValues: {
      introQuestionIds: channelFrame.introQuestionIds
    },
    validationSchema: yup.object({
      introQuestionIds: yup.array().of(
        yup.string().required('Question is required.')
      ).min(1, 'At least one question is required.').max(3, 'No more than 3 questions.')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await updateChannelFrame(channelFrame.channelId, values)

        resetForm({
          values: {
            introQuestionIds: res.data.introQuestionIds
          }
        })

        toast.success('🚀 Channel frame updated!')
      } catch (err) {
        handleError(err, 'Something went wrong updating this channel frame. Please try again later.')
      }
    }
  })

  const copyIntroFrameUrlToClipboard = () => {
    const url = `${process.env.NEXTAUTH_URL ?? window.location.origin}/frames/channels/${channelFrame.channelId}`
    navigator.clipboard.writeText(url)
    toast.success('Frame link copied to clipboard 😎')
  }

  return (
    <CategoriesProvider>
      <AppLayout>
        <Section title={`/${channelFrame.channelId}`}>
          <ListPotentialMembers channelId={channelFrame.channelId} />

          <SubSection title="Your Intro Frame">
            <Input
              value={`${process.env.NEXTAUTH_URL ?? window.location.origin}/frames/channels/${channelFrame.channelId}`}
              label="Intro Frame URL"
              note="Share this frame anytime to start getting users familiar with Intori"
              onClick={() => copyIntroFrameUrlToClipboard()}
              readOnly
            />
          </SubSection>
          <SubSection title="Update Your Intro Frame">
            <SelectIntroQuestions formik={formik} allQuestions={allQuestions} />
            <div>
              {formik.dirty && (
                <>
                  <PrimaryButton disabled={formik.isSubmitting} onClick={() => formik.handleSubmit()}>Save Changes</PrimaryButton>
                  <SecondaryButton disabled={formik.isSubmitting} onClick={() => formik.resetForm()}>Reset</SecondaryButton>
                </>
              )}
            </div>
          </SubSection>

          <SubSection title="Post a Single Question Frame">
            <SelectQuestion channelId={channelFrame.channelId} questions={allQuestions} />
          </SubSection>
        </Section>

        <Section title={`Stats for /${channelFrame.channelId}`}>
          <GeneralStatsSection          channelId={channelFrame.channelId} />
          <UniqueUsersOverTimeChart     channelId={channelFrame.channelId} />
          <MostAnsweredQuestionsChart   channelId={channelFrame.channelId} />
          <TopResponsesForTopQuestions  channelId={channelFrame.channelId} />
        </Section>
      </AppLayout>
    </CategoriesProvider>
  )
}

export default Channel
