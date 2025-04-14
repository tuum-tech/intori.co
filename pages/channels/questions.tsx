import { useState } from "react"
import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"
import { v4 as uuid } from 'uuid'

import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import { QuestionType, getAllQuestions } from '../../models/questions'
import { DisplayQuestions } from '../../components/Questions'
import { PrimaryButton } from '../../components/common/Button'
import { ImportQuestionsButton } from '../../components/Questions/ImportQuestionsButton'
import { CategoriesProvider } from '../../contexts/useCategories'
import { QuestionCategoriesProvider } from '../../contexts/useQuestionCategories'
import { isSuperAdmin } from '../../utils/isSuperAdmin'

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

  if (!isSuperAdmin(fid)) {
    return {
      notFound: true
    }
  }

  const questions = await getAllQuestions()

  return {
    props: {
      questions: questions.reverse().filter((q) => !q.deleted)
    }
  }
}) satisfies GetServerSideProps<Props>

const AdminStats: NextPage<Props> = ({ questions: inQuestions }) => {
  const [questions, setQuestions] = useState<QuestionType[]>(inQuestions)

  const addNewQuestion = async () => {
    const id = `new-` + uuid()
    setQuestions([
      {
        question: '',
        answers: [],
        order: questions.length,
        deleted: false,
        id
      },
      ...questions,
    ])
  }

  return (
    <AppLayout>
      <QuestionCategoriesProvider>
        <CategoriesProvider>
          <Section
            title={`All Questions (${questions.length})`}
            subtitle="Here you can view all frame questions."
          >
            <div style={{ display: 'flex', gap: '1rem' }}>
              <PrimaryButton onClick={addNewQuestion}>
                Add Question
              </PrimaryButton>
              <ImportQuestionsButton />
            </div>
            <br />
            <DisplayQuestions
              questions={questions}
              onQuestionDeleted={(questionId) => {
                setQuestions(questions.filter((question) => question.id !== questionId))
              }}
            />
          </Section>
        </CategoriesProvider>
      </QuestionCategoriesProvider>
    </AppLayout>
  )
}

export default AdminStats
