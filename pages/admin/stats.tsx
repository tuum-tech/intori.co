import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"

import { AppLayout } from "@/layouts/App"
import { getUniqueUserFids, countUserResponses } from '@/models/userAnswers'
import { getAllFrameSessionQuestionCounts } from '@/models/frameSession'
import { Section } from '../../components/common/Section'
import { StatsCard, StatsContainer } from '../../components/Stats/StatsCard'
import { countAllUserQuestionSkips } from '../../models/userQuestionSkip'
import { intoriQuestions } from '../../utils/frames/intoriFrameForms'

type Props = {
  uniqueUsersCount: number
  frameSessionQuestionCounts: number[]
  totalResponses: number
  totalSkips: number
  totalQuestions: number
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

  const fid = parseInt(session.user.fid, 10)
  const adminFids = (process.env.ADMIN_FIDS || '').split(',').map((fid) => parseInt(fid, 10))

  if (!adminFids.includes(fid)) {
    return {
      notFound: true
    }
  }

  const uniqueUsersCount = await getUniqueUserFids()
  const frameSessionQuestionCounts = await getAllFrameSessionQuestionCounts()
  const totalResponses = await countUserResponses()
  const totalSkips = await countAllUserQuestionSkips()
  const totalQuestions = intoriQuestions.length

  return {
    props: {
      uniqueUsersCount,
      frameSessionQuestionCounts,
      totalResponses,
      totalSkips,
      totalQuestions
    }
  }
}) satisfies GetServerSideProps<Props>

const AdminStats: NextPage<Props> = ({
  uniqueUsersCount,
  frameSessionQuestionCounts,
  totalResponses,
  totalSkips,
  totalQuestions
}) => {
  return (
    <AppLayout>
      <Section
        title="Admin Stats"
        subtitle="Here you can see some stats about the frames."
      >
        <StatsContainer>
          <StatsCard
            title="Unique Users"
            value={uniqueUsersCount}
          />

          <StatsCard
            title="Total questions answered"
            value={totalResponses}
          />

          <StatsCard
            title="Users that hit 'Go'"
            value={frameSessionQuestionCounts[0]} 
          />

          <StatsCard
            title="Users that stopped after first question"
            value={frameSessionQuestionCounts[1]} 
          />

          <StatsCard
            title="Users that stopped after second question"
            value={frameSessionQuestionCounts[2]} 
          />

          <StatsCard
            title="Users that answered all 3 questions"
            value={frameSessionQuestionCounts[3]} 
          />

          <StatsCard
            title="Questions Skipped"
            value={totalSkips}
          />

          <StatsCard
            title="Total Questions"
            value={totalQuestions}
          />
        </StatsContainer>
      </Section>
    </AppLayout>
  )
}

export default AdminStats
