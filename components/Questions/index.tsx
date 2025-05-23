import React, { useState, useMemo, useCallback } from 'react'
import { type Question, type AnswerUnlockTopic } from "@prisma/client"
import Input from '../../components/common/Input'
import { Empty } from '../../components/common/Empty'
import { PrimaryButton } from '../../components/common/Button'
import { SelectTopicDropdown } from './SelectTopicDropdown'
import { ViewTopicButton } from './ViewTopicButton'

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
      return []
    }

    return question.topics
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
      <td>
        {
          topics.map((topic) => (
            <ViewTopicButton key={topic} topic={topic} question={question.question} />
          ))
        }
      </td>
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
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePaginatedQuestions(20, searchTerm, selectedTopic)

  const allQuestions = data ? data.pages.flatMap(page => page.questions) : []

  return (
    <>
      <div className={styles.searchContainer}>
        <Input
          value={searchTerm}
          name="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search questions"
        />
      </div>

      <div className={styles.filterContainer}> 
        <SelectTopicDropdown onTopicSelected={setSelectedTopic} />
        { selectedTopic && (
          <PrimaryButton onClick={() => setSelectedTopic("")}>
            Topic: {selectedTopic}
          </PrimaryButton>
        )}
      </div>


      {isLoading && (
        <Empty>Loading questions...</Empty>
      )}
          
      {!isLoading && (
        <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', marginTop: 16 }}>
          <thead>
            <tr>
              <th>Required Topic(s)</th>
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
      )}

      {hasNextPage && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <PrimaryButton onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </PrimaryButton>
        </div>
      )}
    </>
  )
}
