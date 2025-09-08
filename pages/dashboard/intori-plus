import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"

// components
import { AppLayout } from "@/layouts/App"
import { Section } from '@/components/common/Section'
import { UserStatsTable } from '@/components/UserStatsTable'

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

const Dashboard: NextPage = () => {
  return (
    <AppLayout>
      <Section title="User">
        <UserStatsTable />
      </Section>
    </AppLayout>
  )
}

export default Dashboard
