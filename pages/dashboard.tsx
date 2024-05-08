import type { NextPage, GetServerSideProps } from "next";
import Image from 'next/image'
import { useRouter } from "next/router"
import { toast } from 'react-toastify'
import { useSession, getSession, signOut } from "next-auth/react"
import { useEffect, useMemo, useState } from "react";

import BiDataCard from "@/components/common/BiDataCard";
import { AppLayout } from "@/layouts/App"
import { UserAnswerPageType, getUserAnswersByFid } from '../models/userAnswers'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { camelCaseToTitleCase } from '../utils/textHelpers'

type Props = {
  answers: UserAnswerPageType[]
  profileFrameUrl: string
}


export const getServerSideProps = (async (context) => {
  const session = await getSession(context)

  if (!session?.user?.fid) {
    console.log('/dashboard 404 because not logged in', session?.user)
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

const Dashboard: NextPage<Props> = ({ profileFrameUrl, answers }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Frame Link')
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/')
    }
  }, [session, router])

  const loading = useMemo(() => session.status === 'loading', [session])

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(profileFrameUrl)
    toast.success('Profile frame link copied to clipboard 😎')
    setCopyButtonText('Copied!')
    setTimeout(() => {
      setCopyButtonText('Copy Frame Link')
    }, 2000)
  }

  const logout = async (e: React.MouseEvent) => {
    e.preventDefault()

    await signOut()
    window.location.pathname = '/'
  }

  if (loading || !session?.data?.user) {
    return (
      <AppLayout title="Launching...">
        <sub>One moment please...</sub>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Your Profile">
      <div className="text-center mb-4">
        <button className="text-white underline bg-transparent text-base cursor-pointer" onClick={logout}>
          Log Out
        </button>
      </div>
      <div className="text-center text-white mb-4">
          <Image
            className="rounded-full"
            alt='Intori'
            src={session.data.user.image ?? '/intorilogomark.svg'}
            width={170}
            height={170}
          />
        <h2 className="mb-0">@{session.data.user.name}</h2>
        <p className="mt-1">
          #{session.data.user.fid}
        </p>
      </div>
      <div className="w-80 mx-auto mb-8 flex flex-col flex-wrap gap-[18px] justify-center">
        <Input
          label="Your Profile Frame Link"
          value={profileFrameUrl}
          onChange={console.log}
          placeholder="Test"
        />
        <Button title={copyButtonText} onClick={copyUrlToClipboard} />
      </div>
      <div className="w-100 mx-auto flex flex-row flex-wrap gap-[18px] justify-center pb-8">
        {
          answers.map((answer) => (
            <div className="basis-1/3 md:basis-11/12" key={answer.question}>
              <BiDataCard
                title={camelCaseToTitleCase(answer.sequence) + ' - ' + answer.question}
                value={answer.answer}
              />
            </div>
          ))
        }
      </div>
    </AppLayout>
  )
}

export default Dashboard;
