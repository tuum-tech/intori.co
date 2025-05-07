import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"

import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import { PaginatedQuestionsTable } from '../../components/Questions'
import { ImportQuestionsButton } from '../../components/Questions/ImportQuestionsButton'
import { ImportQuestionTopicsButton } from '../../components/Questions/ImportQuestionTopicsButton'
import { ImportAnswerUnlockTopicsButton } from '../../components/Questions/ImportAnswerUnlockTopicsButton'
import { CategoriesProvider } from '../../contexts/useCategories'
import { QuestionCategoriesProvider } from '../../contexts/useQuestionCategories'
import { isSuperAdmin } from '../../utils/isSuperAdmin'

import { useQuestionsCount } from '@/requests/questions'

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

  if (!isSuperAdmin(fid)) {
    return {
      notFound: true
    }
  }

  return {
    props: {}
  }
}) satisfies GetServerSideProps

const AdminStats: NextPage = () => {
  const { data: questionCount } = useQuestionsCount()
  return (
    <AppLayout>
      <QuestionCategoriesProvider>
        <CategoriesProvider>
          <Section
            title={`All Questions ( ${questionCount} )`}
            subtitle="Here you can view all questions."
          >
            <div style={{ display: 'flex', gap: '1rem' }}>
              <ImportQuestionsButton />
              <ImportQuestionTopicsButton />
              <ImportAnswerUnlockTopicsButton />
            </div>
            <br />
            <PaginatedQuestionsTable />
          </Section>
        </CategoriesProvider>
      </QuestionCategoriesProvider>
    </AppLayout>
  )
}

export default AdminStats
