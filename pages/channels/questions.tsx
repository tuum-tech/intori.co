import { useState } from "react"
import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"

import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import { QuestionType, getAllQuestions } from '../../models/questions'
import { DisplayQuestions } from '../../components/Questions'
import { PrimaryButton } from '../../components/common/Button'

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
    props: { questions }
  }
}) satisfies GetServerSideProps<Props>

const AdminStats: NextPage<Props> = ({ questions: inQuestions }) => {
  const [questions, setQuestions] = useState<QuestionType[]>(inQuestions)

  const addNewQuestion = async () => {
    const id = `new-` + Date.now().toString()
    setQuestions([
      ...questions,
      {
        question: '',
        answers: [],
        categories: [],
        order: questions.length,
        id
      },
    ])

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })

  }

  return (
    <AppLayout>
      <Section
        title="All Questions"
        subtitle="Here you can view all frame questions."
      >
        <PrimaryButton onClick={addNewQuestion}>
          Add Question
        </PrimaryButton>
        <br />
        <br />
        <DisplayQuestions
          questions={questions}
          onQuestionDeleted={(questionId) => {
            setQuestions(questions.filter((question) => question.id !== questionId))
          }}
        />
      </Section>
    </AppLayout>
  )
}

export default AdminStats
