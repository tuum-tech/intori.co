import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { FormikContextType } from 'formik'
import { CreateChannelFrameType } from '../../../models/channelFrames'
import { QuestionType } from '../../../models/questions'
import { capitalizeFirstLetter } from '../../../utils/textHelpers'
import { Select } from '../Select'
import styles from './styles.module.css'

type Props = {
  formik: FormikContextType<CreateChannelFrameType>
  allQuestions: QuestionType[]
}

export const SelectIntroQuestions: React.FC<Props> = ({
  formik,
  allQuestions
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const questionCategories = useMemo(() => {
      return (
        Array.from(
          new Set(
            allQuestions
            .flatMap((question) => question.categories)
            .map((category) => category.toLowerCase())
          )
        )
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      )
  }, [allQuestions])

  const handleQuestionSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuestionId = e.target.value
    const selectedQuestion = allQuestions.find((question) => question.id === selectedQuestionId)

    if (selectedQuestion) {
      formik.setFieldValue(
        'introQuestionIds',
        [...formik.values.introQuestionIds, selectedQuestionId]
      )
    }
  }

  const removeQuestion = (questionId: string) => {
    formik.setFieldValue('introQuestionIds', formik.values.introQuestionIds.filter((qid) => qid !== questionId))
    toast.success('Question removed')
  }

  const questionOptions = useMemo(() => {
    return allQuestions
    .filter((question) => {
      const categories = question.categories.map((category) => category.toLowerCase())
      return categories.includes(selectedCategory.toLowerCase())
    })
    .map((question) => ({
      label: question.question,
      value: question.id
    }))
    .filter((question) => !formik.values.introQuestionIds.includes(question.value))
  }, [allQuestions, selectedCategory, formik.values.introQuestionIds])

  const placeholderMessage = useMemo(() => {
    if (formik.values.introQuestionIds.length === 3) {
      return 'You can have up to 3 intro questions'
    }

    if (!selectedCategory) {
      return 'Select a category first'
    }

    if (questionOptions.length === 0) {
      return 'No questions to choose from'
    }

    return 'Select question...'
  }, [formik.values.introQuestionIds, questionOptions, selectedCategory])

  const questionText = useCallback((questionId: string) => {
    return allQuestions.find(
      (question) => question.id === questionId
    )?.question || 'Invalid question.'
  }, [allQuestions])

  return (
    <div className={styles.introQuestionsContainer}>
      <Select
        name="selectCategory"
        label="What category of questions would you like to see?"
        options={questionCategories.map((category) => ({ label: capitalizeFirstLetter(category), value: category }))}
        placeholder="Select category..."
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      />
      <Select
        name="selectQuestion"
        label="Select up to three questions for the intro frame"
        options={questionOptions}
        placeholder={placeholderMessage}
        onChange={handleQuestionSelected}
        disabled={formik.values.introQuestionIds.length === 3}
        value=""
      />
      <ol>
        {
          formik.values.introQuestionIds.map((questionId) => (
            <li key={questionId}>
              <span>{questionText(questionId)}</span>
              <button type="button" title="Remove Question" onClick={() => removeQuestion(questionId)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#AAAAAA" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
              </button>
            </li>
          ))
        }
      </ol>
    </div>
  )
}
