import type { NextPage, GetServerSideProps } from "next";
import { toast } from "react-toastify";
import { useRouter } from "next/router"
import { useSession, getSession } from "next-auth/react"
import { useEffect, useMemo, useState } from "react";

import { AppLayout } from "@/layouts/App"
import { SuggestionType } from '../../models/userAnswers'
import { Skeleton } from '../../components/common/Skeleton'
import { Section } from '../../components/common/Section'
import { PrimaryButton } from '../../components/common/Button'
import { SuggestionRow } from './SuggestionRow'

import styles from './Suggestions.module.css'

type Props = {
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
    props: {}
  }
}) satisfies GetServerSideProps<Props>

const Suggestions: NextPage<Props> = ({}) => {
  const session = useSession()
  const router = useRouter()

  const [loadingSuggestions, setLoadingSuggestions] = useState(true)
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([])

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
      setSuggestions(data)
    }).catch((error) => {
      console.error('Error fetching suggestions:', error)
      toast.error('Failed to fetch suggestions')
    }).finally(() => {
      setLoadingSuggestions(false)
    })
  }, [session.status])

  const loading = useMemo(() => session.status === 'loading' || loadingSuggestions, [session, loadingSuggestions])

  if (loading || !session?.data?.user) {
    return (
      <AppLayout>
      <Section title="Your Suggestions" subtitle="Meet someone new">
        <table className={styles.suggestionsTable}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Type</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr key={index}>
                <td>
                  <span
                    className={styles.avatar}
                    style={{ backgroundColor: 'grey' }}
                  />
                </td>

                <td>
                  <Skeleton width={100 + Math.floor(Math.random() * 41) - 20} />
                </td>

                <td>
                  <Skeleton width={50 + Math.floor(Math.random() * 41) - 20} />
                </td>

                <td>
                  <Skeleton width={350 + Math.floor(Math.random() * 41) - 20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Section title="Your Suggestions" subtitle="Meet someone new">
        <table className={styles.suggestionsTable}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Type</th>
              <th>Reason</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((suggestion, index) => (
              <SuggestionRow
                key={suggestion.user?.fid || suggestion?.channel?.id || index}
                suggestion={suggestion}
              />
            ))}
          </tbody>
        </table>
      </Section>
    </AppLayout>
  )
}

export default Suggestions;
