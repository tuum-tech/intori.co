import type { NextPage, GetServerSideProps } from "next";
import { toast } from "react-toastify";
import { useRouter } from "next/router"
import { useSession, getSession } from "next-auth/react"
import { useEffect, useMemo, useState } from "react";

import { AppLayout } from "@/layouts/App"
import { UserAnswerPageType, getUserAnswersByFid } from '@/models/userAnswers'
import { WelcomeCard } from './WelcomeCard'
import { CallToActionCard } from './CallToActionCard'
import { FarcasterChannelType, FarcasterUserType } from '../../utils/neynarApi'
import { Skeleton } from '../../components/common/Skeleton'

import styles from './Suggestions.module.css'

type Props = {
  answers: UserAnswerPageType[]
  profileFrameUrl: string
}


export const getServerSideProps = (async (context) => {
  const session = await getSession(context)

  if (!session?.user?.fid) {
    return {
      notFound: true
    }
  }

  const answers = await getUserAnswersByFid(
    parseInt(session.user.fid, 10)
  )

  const profileFrameUrl = `${process.env.NEXTAUTH_URL}/frames/profile/${session.user.fid}`

  return {
    props: {
      profileFrameUrl,
      answers: answers
        .filter(answer => answer.date)
        .filter(answer => !['more', '< back', 'back', 'next'].includes(answer.answer.toLowerCase()))
        .map((answer) => {
          return {
            ...answer,
            date: {
              seconds: answer.date.seconds,
              nanoseconds: answer.date.nanoseconds
            }
          }
      })
    }
  }
}) satisfies GetServerSideProps<Props>

const Dashboard: NextPage<Props> = ({ answers }) => {
  const session = useSession()
  const router = useRouter()

  const [loadingSuggestions, setLoadingSuggestions] = useState(true)
  const [suggestedUsers, setSuggestedUsers] = useState<FarcasterUserType[]>([])
  const [suggestedChannels, setSuggestedChannels] = useState<FarcasterChannelType[]>([])

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/')
    }
  }, [session, router])

  useEffect(() => {
    if (session.status !== 'authenticated') {
      return
    }

    fetch(`/api/suggestions`).then(async (res) => {
      if (!res.ok) {
        toast.error('Failed to fetch suggestions')
        return
      }

      const data = await res.json()
      setSuggestedUsers(data.suggestedUsers)
      setSuggestedChannels(data.suggestedChannels)
    }).catch((error) => {
      console.error('Error fetching suggestions:', error)
      toast.error('Failed to fetch suggestions')
    }).finally(() => {
      setLoadingSuggestions(false)
    })
  }, [session])

  const loading = useMemo(() => session.status === 'loading', [session])

  const totalSuggestions = useMemo(() => {
    return (suggestedUsers?.length ?? 0) + (suggestedChannels?.length ?? 0)
  }, [suggestedUsers, suggestedChannels])


  if (loading || !session?.data?.user) {
    return (
      <AppLayout>
        <sub>One moment please...</sub>
      </AppLayout>
    )
  }

  if (loadingSuggestions) {
    return (
      <AppLayout>
        <div className={styles.welcomeRow}>
          <div className={styles.welcomeMessage}>
            <h1 className="mb-0">Welcome, {session.data.user.name}</h1>
            <h2>Track & Manage your data history.</h2>
              <CallToActionCard title="Suggestions">
                <div><Skeleton width="90px" inline /></div>
                <div><Skeleton width="122px" inline /></div>
              </CallToActionCard>
          </div>

          <WelcomeCard
            icon={<svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.7697 7.87689C17.0161 7.87407 17.2845 7.871 17.5282 7.871C17.7903 7.871 18 8.081 18 8.3435V16.7855C18 19.3895 15.8928 21.5 13.293 21.5H4.94817C2.22248 21.5 0 19.2845 0 16.5545V5.2355C0 2.6315 2.11765 0.5 4.72801 0.5H10.3261C10.5987 0.5 10.8084 0.7205 10.8084 0.983V4.364C10.8084 6.2855 12.3914 7.8605 14.3098 7.871C14.758 7.871 15.153 7.87432 15.4987 7.87723C15.7677 7.87949 16.0068 7.8815 16.2178 7.8815C16.3671 7.8815 16.5605 7.87929 16.7697 7.87689ZM5.7449 15.609H11.4479C11.8777 15.609 12.2341 15.252 12.2341 14.8215C12.2341 14.391 11.8777 14.0445 11.4479 14.0445H5.7449C5.31508 14.0445 4.95865 14.391 4.95865 14.8215C4.95865 15.252 5.31508 15.609 5.7449 15.609ZM9.28829 8.79448H5.7449C5.31508 8.79448 4.95865 9.15148 4.95865 9.58198C4.95865 10.0125 5.31508 10.359 5.7449 10.359H9.28829C9.71811 10.359 10.0745 10.0125 10.0745 9.58198C10.0745 9.15148 9.71811 8.79448 9.28829 8.79448Z" fill="#F6F4FE"/> <path d="M17.0588 6.34503C16.1971 6.34818 15.1812 6.34503 14.4505 6.33768C13.2911 6.33768 12.336 5.38113 12.336 4.21983V1.45203C12.336 0.999481 12.8843 0.774781 13.1978 1.10133C13.7653 1.69236 14.5452 2.50485 15.3216 3.31356C16.0955 4.11973 16.8657 4.92214 17.4184 5.49768C17.7245 5.81583 17.5002 6.34398 17.0588 6.34503Z" fill="#F6F4FE"/> </svg>}
            title="Total Suggestions"
          >
            <Skeleton width="100px" inline />
          </WelcomeCard>

          <WelcomeCard
            icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5671 3.01626C14.5671 5.45872 16.5505 7.43872 18.9972 7.43872C19.2666 7.43739 19.5353 7.41154 19.8 7.36147V16.1291C19.8 19.8177 17.6236 22 13.9287 22H5.881C2.17636 22 0 19.8177 0 16.1291V8.09533C0 4.40673 2.17636 2.20515 5.881 2.20515H14.6445C14.5925 2.47239 14.5665 2.74403 14.5671 3.01626ZM12.2642 14.1861L15.4078 10.1306V10.1113C15.6769 9.74976 15.6082 9.23996 15.253 8.96223C15.0811 8.82954 14.8626 8.7721 14.6475 8.80304C14.4324 8.83397 14.2391 8.95064 14.1116 9.12638L11.4613 12.535L8.44344 10.1596C8.27114 10.0254 8.05195 9.96613 7.83537 9.9952C7.61878 10.0243 7.42306 10.1392 7.29239 10.3141L4.04236 14.5048C3.92812 14.6471 3.86662 14.8245 3.86825 15.0069C3.84939 15.3755 4.08224 15.7104 4.43479 15.8217C4.78735 15.9329 5.17069 15.7925 5.36752 15.48L8.08555 11.9653L11.1034 14.331C11.2751 14.4693 11.4957 14.532 11.7146 14.5047C11.9335 14.4774 12.1319 14.3624 12.2642 14.1861Z" fill="#F6F4FE"/> <path d="M22 2.74928C22 4.26767 20.7688 5.49857 19.25 5.49857C17.7312 5.49857 16.5 4.26767 16.5 2.74928C16.5 1.2309 17.7312 0 19.25 0C20.7688 0 22 1.2309 22 2.74928Z" fill="#F6F4FE"/> </svg>}
            title="Questions answered"
          >
            <Skeleton width="80px" inline />
          </WelcomeCard>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className={styles.welcomeRow}>
        <div className={styles.welcomeMessage}>
          <h1 className="mb-0">Welcome, {session.data.user.name}</h1>
          <h2>Track & Manage your data history.</h2>

          <CallToActionCard title="Suggestions">
            <div><span>{suggestedUsers?.length || 0}</span> Users</div>
            <div><span>{suggestedChannels?.length || 0}</span> Channels</div>
          </CallToActionCard>
        </div>

        <WelcomeCard
          icon={<svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.7697 7.87689C17.0161 7.87407 17.2845 7.871 17.5282 7.871C17.7903 7.871 18 8.081 18 8.3435V16.7855C18 19.3895 15.8928 21.5 13.293 21.5H4.94817C2.22248 21.5 0 19.2845 0 16.5545V5.2355C0 2.6315 2.11765 0.5 4.72801 0.5H10.3261C10.5987 0.5 10.8084 0.7205 10.8084 0.983V4.364C10.8084 6.2855 12.3914 7.8605 14.3098 7.871C14.758 7.871 15.153 7.87432 15.4987 7.87723C15.7677 7.87949 16.0068 7.8815 16.2178 7.8815C16.3671 7.8815 16.5605 7.87929 16.7697 7.87689ZM5.7449 15.609H11.4479C11.8777 15.609 12.2341 15.252 12.2341 14.8215C12.2341 14.391 11.8777 14.0445 11.4479 14.0445H5.7449C5.31508 14.0445 4.95865 14.391 4.95865 14.8215C4.95865 15.252 5.31508 15.609 5.7449 15.609ZM9.28829 8.79448H5.7449C5.31508 8.79448 4.95865 9.15148 4.95865 9.58198C4.95865 10.0125 5.31508 10.359 5.7449 10.359H9.28829C9.71811 10.359 10.0745 10.0125 10.0745 9.58198C10.0745 9.15148 9.71811 8.79448 9.28829 8.79448Z" fill="#F6F4FE"/> <path d="M17.0588 6.34503C16.1971 6.34818 15.1812 6.34503 14.4505 6.33768C13.2911 6.33768 12.336 5.38113 12.336 4.21983V1.45203C12.336 0.999481 12.8843 0.774781 13.1978 1.10133C13.7653 1.69236 14.5452 2.50485 15.3216 3.31356C16.0955 4.11973 16.8657 4.92214 17.4184 5.49768C17.7245 5.81583 17.5002 6.34398 17.0588 6.34503Z" fill="#F6F4FE"/> </svg>}
          title="Total Suggestions"
        >
          {totalSuggestions}
        </WelcomeCard>

        <WelcomeCard
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5671 3.01626C14.5671 5.45872 16.5505 7.43872 18.9972 7.43872C19.2666 7.43739 19.5353 7.41154 19.8 7.36147V16.1291C19.8 19.8177 17.6236 22 13.9287 22H5.881C2.17636 22 0 19.8177 0 16.1291V8.09533C0 4.40673 2.17636 2.20515 5.881 2.20515H14.6445C14.5925 2.47239 14.5665 2.74403 14.5671 3.01626ZM12.2642 14.1861L15.4078 10.1306V10.1113C15.6769 9.74976 15.6082 9.23996 15.253 8.96223C15.0811 8.82954 14.8626 8.7721 14.6475 8.80304C14.4324 8.83397 14.2391 8.95064 14.1116 9.12638L11.4613 12.535L8.44344 10.1596C8.27114 10.0254 8.05195 9.96613 7.83537 9.9952C7.61878 10.0243 7.42306 10.1392 7.29239 10.3141L4.04236 14.5048C3.92812 14.6471 3.86662 14.8245 3.86825 15.0069C3.84939 15.3755 4.08224 15.7104 4.43479 15.8217C4.78735 15.9329 5.17069 15.7925 5.36752 15.48L8.08555 11.9653L11.1034 14.331C11.2751 14.4693 11.4957 14.532 11.7146 14.5047C11.9335 14.4774 12.1319 14.3624 12.2642 14.1861Z" fill="#F6F4FE"/> <path d="M22 2.74928C22 4.26767 20.7688 5.49857 19.25 5.49857C17.7312 5.49857 16.5 4.26767 16.5 2.74928C16.5 1.2309 17.7312 0 19.25 0C20.7688 0 22 1.2309 22 2.74928Z" fill="#F6F4FE"/> </svg>}
          title="Questions answered"
        >
          {answers.length}
        </WelcomeCard>
      </div>
    </AppLayout>
  )
}

export default Dashboard;
