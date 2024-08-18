import type { NextPage, GetServerSideProps } from "next";
import { toast } from "react-toastify";
import { useRouter } from "next/router"
import { useSession, getSession } from "next-auth/react"
import { useEffect, useMemo, useState } from "react";

import { AppLayout } from "@/layouts/App"
import { SuggestionType } from '../../models/userAnswers'
import { Section } from '../../components/common/Section'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { SuggestionsTable, LoadingSuggestionsTable } from '../../components/Suggestions/SuggestionsTable'

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
}) satisfies GetServerSideProps

const Suggestions: NextPage = () => {
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

  const userSuggestions = useMemo(() => {
    return suggestions
      .filter((suggestion) => suggestion.user)
      .sort((a, b) => b.reason.length - a.reason.length)
  }, [suggestions])

  if (loading || !session?.data?.user) {
    return (
      <AppLayout>
        <Section title="Suggested Follows" subtitle="Meet someone new">
          <Tabs>
            <TabList>
              <Tab>Users (0)</Tab>
              <Tab>Channels (0)</Tab>
            </TabList>

            <TabPanel>
              <LoadingSuggestionsTable />
            </TabPanel>

            <TabPanel>
              <LoadingSuggestionsTable />
            </TabPanel>
          </Tabs>
        </Section>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Section title="Suggested Follows" subtitle="Meet someone new">
        <Tabs>
          <TabList>
            <Tab>Users ({userSuggestions.length})</Tab>
            <Tab>Channels (0)</Tab>
          </TabList>

          <TabPanel>
            <SuggestionsTable suggestions={userSuggestions} />
          </TabPanel>

          <TabPanel>
            <SuggestionsTable suggestions={[]} />
          </TabPanel>
        </Tabs>
      </Section>
    </AppLayout>
  )
}

export default Suggestions;
