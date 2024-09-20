import React, { useMemo } from 'react'
import { useCategories } from '@/contexts/useCategories'
import { QuestionType } from '@/models/questions'
import { CategoryType } from '@/models/categories'
import { useQuestionCategories } from '@/contexts/useQuestionCategories'
import Input from '@/components/common/Input'
import { DangerButton } from '@/components/common/Button'
import styles from './styles.module.css'

const OneCategoryOverview: React.FC<{
  category: CategoryType
  questions: QuestionType[]
}> = ({
  category,
  questions
}) => {
  const { removeCategory } = useCategories()
  const { questionCategories, removeQuestionCategory } = useQuestionCategories()

  const questionsOfThisCategory = useMemo(() => {
    const questionIds = questionCategories
      .filter((qc) => qc.categoryId === category.id)
      .map((qc) => qc.questionId)

    return questions.filter((q) => questionIds.includes(q.id))
  }, [questionCategories, questions, category])

  const removeQuestion = (question: QuestionType) => {
    const body = {
      questionId: question.id,
      categoryId: category.id
    }
    removeQuestionCategory(body)
  }

  return (
    <div className={styles.oneCategoryOverview} key={category.id}>
      <h2>{category.category}</h2>
      <details>
        <summary>View {questionsOfThisCategory.length} Question{questionsOfThisCategory.length === 1 ? '' : 's'}</summary>
        {
          questionsOfThisCategory.map((q) => (
            <div key={q.id} className={styles.question}>
              <h4>{q.question}</h4>
              <button type="button" onClick={() => removeQuestion(q)} title="Remove Question from Category">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
              </button>
            </div>
          ))
        }
      </details>
      <div className={styles.actions}>
        <DangerButton onClick={() => removeCategory(category.id)}>
          Delete
        </DangerButton>
      </div>
    </div>
  )
}

type Props = {
  questions: QuestionType[]
}

export const CategoriesOverview: React.FC<Props> = ({ questions }) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const { allCategories } = useCategories()

  allCategories.sort((a, b) => a.category.toLowerCase().localeCompare(b.category.toLowerCase()))

  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      return allCategories
    }

    return allCategories.filter((category) => {
      return category.category.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    })
  }, [searchTerm, allCategories])

  return (
    <div className={styles.categoriesOverview}>
      <div className={styles.searchContainer}>
        <Input
          value={searchTerm}
          name="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search categories by name..."
          label="Search"
        />
      </div>
      {
        filteredCategories.map((category) => (
          <OneCategoryOverview
            key={category.id}
            category={category}
            questions={questions}
          />
        ))
      }
    </div>
  )
}

