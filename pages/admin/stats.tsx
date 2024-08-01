import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"
import { channelFrames } from '../../utils/frames/channelFrames'

// components
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { AppLayout } from "@/layouts/App"
import { Section, SectionTopActions } from '../../components/common/Section'
import { StatsCard, StatsContainer } from '../../components/Stats/StatsCard'
import { PrimaryButton } from '../../components/common/Button'
import { GeneralStatsSection } from '../../components/Stats/GeneralStatsSection'

type Props = {
  showSuperAdminTab: boolean
  channelFramesToShow: string[]
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

  if (!session.admin && !session.channelAdmin?.length) {
    return {
      notFound: true
    }
  }

  if (session.admin) {
    return {
      props: {
        showSuperAdminTab: true,
        channelFramesToShow: channelFrames.map((channel) => channel.channelId)
      }
    }
  }

  const channelFramesToShow = channelFrames.filter((channel) => {
    return channel.adminFid === parseInt(session.user.fid, 10)
  }).map((channel) => channel.channelId)

  return {
    props: {
      showSuperAdminTab: false,
      channelFramesToShow
    }
  }
}) satisfies GetServerSideProps<Props>

const AdminStats: NextPage<Props> = ({
  showSuperAdminTab,
  channelFramesToShow
}) => {
  return (
    <AppLayout>
      <Section
        title="Admin Stats"
        subtitle="Here you can see some stats about Intori frames."
      >
        <Tabs forceRenderTabPanel>
          <TabList>
            { showSuperAdminTab && <Tab>Super Admin</Tab> }
            { channelFramesToShow.map((channelId) => (
              <Tab key={channelId}>{`/${channelId}`}</Tab>
            ))}
          </TabList>

          { showSuperAdminTab && (
            <TabPanel>
              <GeneralStatsSection />
            </TabPanel>
          )}

          { channelFramesToShow.map((channelId) => (
            <TabPanel key={channelId}>
              <GeneralStatsSection channelId={channelId} />
            </TabPanel>
          ))}
        </Tabs>
      </Section>
    </AppLayout>
  )
}

export default AdminStats
