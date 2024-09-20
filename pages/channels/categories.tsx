import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"

import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import { QuestionType, getAllQuestions } from '../../models/questions'
import { PrimaryButton } from '../../components/common/Button'
import { CategoriesProvider, useCategories } from '../../contexts/useCategories'
import { QuestionCategoriesProvider } from '../../contexts/useQuestionCategories'
import { CategoriesOverview } from '../../components/Categories/CategoriesOverview'

type Props = {
  questions: QuestionType[]
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
  const adminFids = (process.env.ADMIN_FIDS || '').split(',').map((fid) => parseInt(fid, 10))

  if (!adminFids.includes(fid)) {
    return {
      notFound: true
    }
  }

  const questions = await getAllQuestions()

  return {
    props: {
      questions
    }
  }
}) satisfies GetServerSideProps<Props>

const Categories: React.FC<Props> = ({ questions }) => {
  const { allCategories, showAddCategoryModal } = useCategories()

  return (
    <AppLayout>
      <Section
        title={`All Categories (${allCategories.length})`}
        subtitle="Here you can view all categories for frame questions."
      >
        <PrimaryButton onClick={showAddCategoryModal}>
          Add Category
        </PrimaryButton>
        <br />
        <br />
        <CategoriesOverview questions={questions} />
      </Section>
    </AppLayout>
  )
}

const Page: NextPage<Props> = ({ questions }) => {
  return (
    <QuestionCategoriesProvider>
      <CategoriesProvider>
        <Categories questions={questions} />
      </CategoriesProvider>
    </QuestionCategoriesProvider>
  )
}

export default Page
