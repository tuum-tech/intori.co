import React, { useState } from 'react'
import { type DailyCheckInQuestion } from "@prisma/client"
import Input from '../../common/Input'
import { Empty } from '../../common/Empty'
import { PrimaryButton } from '../../common/Button'
import { usePaginatedDailyCheckInQuestions } from '../../../requests/dailyCheckInQuestions'
import styles from './styles.module.css'

const DailyCheckInQuestionRow = ({ question }: { question: DailyCheckInQuestion }) => {
  return (
    <tr>
      <td>{question.category}</td>
      <td>{question.question}</td>
      <td>
        {question.answers.map((answer) => (
          <div key={answer} className={styles.answerBadge}>
            {answer}
          </div>
        ))}
      </td>
    </tr>
  )
}

export const PaginatedDailyCheckInQuestionsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePaginatedDailyCheckInQuestions(20, searchTerm)

  const allQuestions = data ? data.pages.flatMap(page => page.questions) : []

  return (
    <>
      <div className={styles.searchContainer}>
        <Input
          value={searchTerm}
          name="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search daily check-in questions"
        />
      </div>

      {isLoading && (
        <Empty>Loading daily check-in questions...</Empty>
      )}
          
      {!isLoading && allQuestions.length === 0 && (
        <Empty>No daily check-in questions</Empty>
      )}
      
      {!isLoading && allQuestions.length > 0 && (
        <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', marginTop: 16 }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Question</th>
              <th>Answers</th>
            </tr>
          </thead>
          <tbody>
            {allQuestions.map((q) => (
              <DailyCheckInQuestionRow key={q.id} question={q} />
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
