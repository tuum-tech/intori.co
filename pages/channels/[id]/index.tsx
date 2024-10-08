import type { NextPage, GetServerSideProps } from "next";
import { toast } from 'react-toastify'
import { getSession } from "next-auth/react"
import React from 'react'
import { AppLayout } from "@/layouts/App"
import { Section } from '../../../components/common/Section'
import { ChannelFrameType, getChannelFrame } from '../../../models/channelFrames'
import { QuestionType, getAllQuestions } from '../../../models/questions'
import { ListPotentialMembers } from '../../../components/PotentialMembers'
import { SelectQuestion } from '../../../components/common/SelectQuestion'

// stats components
import { GeneralStatsSection } from '../../../components/Stats/GeneralStatsSection'
import { UniqueUsersOverTimeChart } from '../../../components/Stats/UniqueUsersOverTimeChart'
import { MostAnsweredQuestionsChart } from '../../../components/Stats/MostAnsweredQuestionsChart'
import { TopResponsesForTopQuestions } from '../../../components/Stats/TopResponsesForTopQuestions'
import Input from '../../../components/common/Input'

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
  const copyIntroFrameUrlToClipboard = () => {
    const url = `${process.env.NEXTAUTH_URL ?? window.location.origin}/frames/channels/${channelFrame.channelId}`
    navigator.clipboard.writeText(url)
    toast.success('Frame link copied to clipboard 😎')
  }

  return (
    <AppLayout>
      <Section title={`/${channelFrame.channelId}`}>
        <ListPotentialMembers channelId={channelFrame.channelId} />

        <Input
          value={`${process.env.NEXTAUTH_URL ?? window.location.origin}/frames/channels/${channelFrame.channelId}`}
          label="Intro Frame URL"
          note="Share this frame anytime to start getting users familiar with Intori"
          onClick={() => copyIntroFrameUrlToClipboard()}
          readOnly
        />

        <h2>Intro Questions</h2>
        <ol>
          {
            channelFrame.introQuestionIds?.map((questionId) => {
              const question = allQuestions.find(q => q.id === questionId)
              return (
                <li key={questionId}>
                  {question?.question}
                </li>
              )
            })
          }
        </ol>
        <br />

        <SelectQuestion channelId={channelFrame.channelId} questions={allQuestions} />
      </Section>

      <Section title={`Stats for /${channelFrame.channelId}`}>
        <GeneralStatsSection          channelId={channelFrame.channelId} />
        <UniqueUsersOverTimeChart     channelId={channelFrame.channelId} />
        <MostAnsweredQuestionsChart   channelId={channelFrame.channelId} />
        <TopResponsesForTopQuestions  channelId={channelFrame.channelId} />
      </Section>
    </AppLayout>
  )
}

export default Channel
