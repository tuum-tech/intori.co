import { useEffect, useCallback, useState } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router"
import { useSession, getSession } from "next-auth/react"

import { AppLayout } from "@/layouts/App"
import { ListResponses } from '../../components/Responses/OneResponseCard'
import { Section } from '../../components/common/Section'
import { SwitchAutoPublish } from '../../components/UserBlockchainSettings/SwitchAutoPublish'
import {
  getUserAnswersByFid,
  UserAnswerPageType
} from '../../models/userAnswers'

type Props = {
  userAnswers: UserAnswerPageType[]
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
  const userAnswers = await getUserAnswersByFid(fid)

  return {
    props: {
      userAnswers: userAnswers.map((answer) => ({
        ...answer,
        date: {
          seconds: answer.date.seconds,
          nanoseconds: answer.date.nanoseconds
        }
      })).filter((response, index) => {
        return userAnswers.findIndex((a) => a.question === response.question) === index
      })
    }
  }
}) satisfies GetServerSideProps<Props>

const Responses: NextPage<Props> = ({ userAnswers }) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/')
    }
  }, [session, router])

  return (
    <AppLayout>
      <Section title="Your Responses" subtitle="You can now publish your responses to the blockchain.">
        <SwitchAutoPublish />
        <ListResponses responses={userAnswers} />
      </Section>
    </AppLayout>
  )
}

export default Responses
