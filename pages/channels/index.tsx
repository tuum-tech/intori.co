import type { NextPage, GetServerSideProps } from "next";
import Link from 'next/link'
import { getSession } from "next-auth/react"
import { ChannelFrameType, getAllChannelFrames } from '../../models/channelFrames'

// components
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { AppLayout } from "@/layouts/App"
import { Section, SectionTopActions } from '../../components/common/Section'
import { PrimaryButton } from '../../components/common/Button'
import { GeneralStatsSection } from '../../components/Stats/GeneralStatsSection'
import { UniqueUsersOverTimeChart } from '../../components/Stats/UniqueUsersOverTimeChart'
import { MostAnsweredQuestionsChart } from '../../components/Stats/MostAnsweredQuestionsChart'
import { TopResponsesForTopQuestions } from '../../components/Stats/TopResponsesForTopQuestions'
import Input from "../../components/common/Input";
import { SelectQuestion } from '../../components/common/SelectQuestion'
import { Empty } from '../../components/common/Empty'
import { QuestionType, getAllQuestions } from '../../models/questions'

type Props = {
  showSuperAdminTab: boolean
  channelFramesToShow: ChannelFrameType[]
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

  const channelFramesToShow = await getAllChannelFrames({
    adminFid: session.admin ? undefined : parseInt(session.user.fid, 10)
  })

  const allQuestions = await getAllQuestions()

  allQuestions.sort((a, b) => {
    return a.question.localeCompare(b.question)
  })

  return {
    props: {
      showSuperAdminTab: !!session.admin,
      allQuestions,
      channelFramesToShow
    }
  }
}) satisfies GetServerSideProps<Props>

const AdminStats: NextPage<Props> = ({
  showSuperAdminTab,
  allQuestions,
  channelFramesToShow
}) => {
  return (
    <AppLayout>
      <Section
        title="Channel Frames & Stats"
        subtitle="Here you can create Intori frames for your channel and view stats."
      >
        <SectionTopActions>
          <Link href="/channels/create">
            <PrimaryButton>
              Create Channel Frame
            </PrimaryButton>
          </Link>
        </SectionTopActions>
        <Tabs forceRenderTabPanel>
          <TabList>
            { showSuperAdminTab && <Tab>Super Admin</Tab> }
            { channelFramesToShow.map((channel) => (
              <Tab key={channel.channelId}>{`/${channel.channelId}`}</Tab>
            ))}
          </TabList>

          { showSuperAdminTab && (
            <TabPanel>
              <SectionTopActions>
                <Link href="/channels/questions">
                  <PrimaryButton>
                    Edit Questions
                  </PrimaryButton>
                </Link>
                <a href="/api/stats/csv" target="_blank" rel="noopener noreferrer">
                  <PrimaryButton>
                    Download CSV
                  </PrimaryButton>
                </a>
              </SectionTopActions>
              <GeneralStatsSection />
              <UniqueUsersOverTimeChart />
              <MostAnsweredQuestionsChart />
              <TopResponsesForTopQuestions />
            </TabPanel>
          )}

          { channelFramesToShow.map(({ channelId }) => (
            <TabPanel key={channelId}>
              <Input
                value={`${process.env.NEXTAUTH_URL ?? window.location.origin}/frames/channels/${channelId}`}
                label="Intro Frame URL"
                note="Share this frame anytime to start getting users familiar with Intori"
                readOnly
              />

              <SelectQuestion channelId={channelId} questions={allQuestions} />

              <hr />
              <GeneralStatsSection channelId={channelId} />
              <UniqueUsersOverTimeChart channelId={channelId} />
              <MostAnsweredQuestionsChart channelId={channelId} />
              <TopResponsesForTopQuestions channelId={channelId} />
            </TabPanel>
          ))}
        </Tabs>
        { !showSuperAdminTab && !channelFramesToShow.length && (
          <Empty>You don&apos;t have any channel frames yet. Create one now!</Empty>
        )}
      </Section>
    </AppLayout>
  )
}

export default AdminStats
