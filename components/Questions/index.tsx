import React, { useState, useMemo, useCallback } from 'react'
import { type Question, type AnswerUnlockTopic } from "@prisma/client"
import Input from '../../components/common/Input'

import { usePaginatedQuestions } from '../../requests/questions'
import { useAnswerUnlockTopic } from '../../requests/answerUnlockTopic'

import styles from './styles.module.css'

const AnswerUnlockTopics = ({
  unlockTopics
}: {
  unlockTopics?: AnswerUnlockTopic
}) => {
  if (!unlockTopics || !unlockTopics.unlockTopics.length) {
    return null
  }

  return <span>&nbsp;({unlockTopics.unlockTopics.map((t) => `🔓 ${t}`).join(', ')})</span>
}

const QuestionRow = ({ question }: { question: Question }) => {
  const {
    data: answerUnlockTopics,
  } = useAnswerUnlockTopic({ question: question.question })

  const topics = useMemo(() => {
    if (!question.topics?.length) {
      return ''
    }

    return question.topics.join(', ')
  }, [question])

  const getAnswerUnlockTopics = useCallback((answer: string) => {
    if (!answerUnlockTopics) {
      return undefined
    }

    const unlockTopics = answerUnlockTopics.find(
      (unlockTopic) => unlockTopic.answer === answer
    )

    return unlockTopics
  }, [answerUnlockTopics])

  return (
    <tr>
      <td>{topics}</td>
      <td>{question.question}</td>
      <td>
        {question.answers.map((answer) => (
          <div key={answer} className={styles.answerBadge}>
            {answer}
            <AnswerUnlockTopics
              unlockTopics={getAnswerUnlockTopics(answer)}
            />
          </div>
        ))}
      </td>
    </tr>
  )
}

export const PaginatedQuestionsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePaginatedQuestions(20, searchTerm)

  const allQuestions = data ? data.pages.flatMap(page => page.questions) : []

  return (
    <>
      <div className={styles.searchContainer}>
        <Input
          value={searchTerm}
          name="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search questions ( case sensitive, must be exact )"
        />
      </div>

      <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', marginTop: 16 }}>
        <thead>
          <tr>
            <th>Topics</th>
            <th>Question</th>
            <th>Answers</th>
          </tr>
        </thead>
        <tbody>
          {allQuestions.map((q) => (
            <QuestionRow key={q.id} question={q} />
          ))}
        </tbody>
      </table>

      {hasNextPage && (
        <div style={{ marginTop: 16 }}>
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  )
}
