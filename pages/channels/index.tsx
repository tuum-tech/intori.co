import type { NextPage, GetServerSideProps } from "next";
import Link from 'next/link'
import { getSession } from "next-auth/react"
import { ChannelFrameType, getAllChannelFrames } from '../../models/channelFrames'

// components
import { AppLayout } from "@/layouts/App"
import { Section, SectionTopActions } from '../../components/common/Section'
import { PrimaryButton } from '../../components/common/Button'
import { GeneralStatsSection } from '../../components/Stats/GeneralStatsSection'
import { UniqueUsersOverTimeChart } from '../../components/Stats/UniqueUsersOverTimeChart'
import { MostAnsweredQuestionsChart } from '../../components/Stats/MostAnsweredQuestionsChart'
import { TopResponsesForTopQuestions } from '../../components/Stats/TopResponsesForTopQuestions'
import { Empty } from '../../components/common/Empty'
import { ChannelCardsContainer, ChannelCardLink } from '../../components/Channels/ChannelCardLink'
import { getModeratedChannelsOfUser } from '../../utils/neynarApi'

type Props = {
  showSuperAdminTab: boolean
  channelFramesToShow: ChannelFrameType[]
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

  const allChannelFrames = await getAllChannelFrames()
  const moderatedChannelIds = session.admin ? [] : await getModeratedChannelsOfUser(fid)

  const channelFramesToShow = allChannelFrames.filter((channelFrame) => {
    if (session.admin) {
      return true
    }

    if (channelFrame.adminFid === fid) {
      return true
    }

    return moderatedChannelIds.includes(channelFrame.channelId)
  })

  return {
    props: {
      showSuperAdminTab: session.admin,
      channelFramesToShow
    }
  }
}) satisfies GetServerSideProps<Props>

const Channels: NextPage<Props> = ({
  showSuperAdminTab,
  channelFramesToShow
}) => {

  return (
    <AppLayout>
      <Section
        title="Channel Frames"
        subtitle="Here you can create Intori frames for your channel and view stats."
      >
        <SectionTopActions>
          <Link href="/channels/create">
            <PrimaryButton>
              Create Channel Frame
            </PrimaryButton>
          </Link>
        </SectionTopActions>

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

        <ChannelCardsContainer>
          { channelFramesToShow.map((channelFrame) => (
            <ChannelCardLink key={channelFrame.channelId} channelFrame={channelFrame} />
          ))}
        </ChannelCardsContainer>

        { !showSuperAdminTab && !channelFramesToShow.length && (
          <Empty>You don&apos;t have any channel frames yet. Create one now!</Empty>
        )}
      </Section>

      { showSuperAdminTab && (
        <Section title="Overal Stats">
          <GeneralStatsSection />
          <UniqueUsersOverTimeChart />
          <MostAnsweredQuestionsChart />
          <TopResponsesForTopQuestions />
        </Section>
      )}
    </AppLayout>
  )
}

export default Channels
