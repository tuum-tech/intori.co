import type { NextPage, GetServerSideProps } from "next";
import Link from 'next/link'
import { getSession } from "next-auth/react"

// components
import { AppLayout } from "@/layouts/App"
import { Section, SectionTopActions } from '../../components/common/Section'
import { PrimaryButton } from '../../components/common/Button'
import { GeneralStatsSection } from '../../components/Stats/GeneralStatsSection'
import { UniqueUsersOverTimeChart } from '../../components/Stats/UniqueUsersOverTimeChart'
import { Empty } from '../../components/common/Empty'
import { UserStatsTable } from '@/components/UserStatsTable'

type Props = {
  showSuperAdminTab: boolean
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

  return {
    props: {
      showSuperAdminTab: session.admin,
    }
  }
}) satisfies GetServerSideProps<Props>

const Channels: NextPage<Props> = ({
  showSuperAdminTab
}) => {

  return (
    <AppLayout>
      <Section
        title="Stats"
        subtitle="Here you can find stats"
      >
        { showSuperAdminTab && (
          <SectionTopActions>
            <Link href="/channels/questions">
              <PrimaryButton>
                Edit Questions
              </PrimaryButton>
            </Link>
            <Link href="/channels/categories">
              <PrimaryButton>
                Edit Categories
              </PrimaryButton>
            </Link>
            <a href="/api/stats/csv" target="_blank" rel="noopener noreferrer">
              <PrimaryButton>
                Download CSV
              </PrimaryButton>
            </a>
          </SectionTopActions>
        )}

        { !showSuperAdminTab && (
          <Empty>Nothing to show here.</Empty>
        )}
      </Section>

      { showSuperAdminTab && (
        <Section title="Overal Stats">
          <GeneralStatsSection />
          <UniqueUsersOverTimeChart />
        </Section>
      )}

      { showSuperAdminTab && (
        <Section title="User Stats">
          <UserStatsTable />
        </Section>
      )}
    </AppLayout>
  )
}

export default Channels
