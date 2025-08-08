import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"

import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import { ImportDailyCheckInQuestionsButton } from '../../components/Questions/ImportDailyCheckInQuestionsButton'
import { PaginatedDailyCheckInQuestionsTable } from '../../components/Questions/PaginatedDailyCheckInQuestionsTable'

export const getServerSideProps = (async (context) => {
  const session = await getSession(context)

  if (!session?.user?.fid || !session.admin) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  return {
    props: {}
  }
}) satisfies GetServerSideProps

const DailyCheckInQuestions: NextPage = () => {
  return (
    <AppLayout>
      <Section
        title="Daily Check-in Questions"
        subtitle="Here you can manage daily check-in questions."
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <ImportDailyCheckInQuestionsButton />
        </div>
        <br />
        <PaginatedDailyCheckInQuestionsTable />
      </Section>
    </AppLayout>
  )
}

export default DailyCheckInQuestions
