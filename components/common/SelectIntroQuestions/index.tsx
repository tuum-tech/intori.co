import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { FormikContextType } from 'formik'
import { CreateChannelFrameType, UpdateChannelFrameBodyType } from '../../../models/channelFrames'
import { QuestionType } from '../../../models/questions'
import { QuestionCategoryType } from '../../../models/questionCategories'
import { Select } from '../Select'
import { useCategories } from '../../../contexts/useCategories'
import { getAllQuestionsOfCategory } from '../../../requests/questionCategories'
import styles from './styles.module.css'

type Props = {
  formik: FormikContextType<UpdateChannelFrameBodyType | CreateChannelFrameType>
  allQuestions: QuestionType[]
}

export const SelectIntroQuestions: React.FC<Props> = ({
  formik,
  allQuestions
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [questionCategories, setQuestionCategories] = useState<QuestionCategoryType[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  const { allCategories } = useCategories()

  const fetchQuestionCategoriesForSelectedCategory = useCallback(async () => {
    if (!selectedCategoryId) {
      return
    }

    setLoadingQuestions(true)

    try {
      const res = await getAllQuestionsOfCategory(selectedCategoryId)
      setQuestionCategories(res.data)
    } catch (err) {
      setQuestionCategories([])
      toast.error('Failed to load questions for the selected category')
    }

    setLoadingQuestions(false)
  },[selectedCategoryId])

  useEffect(() => {
    fetchQuestionCategoriesForSelectedCategory()
  }, [fetchQuestionCategoriesForSelectedCategory])

  const categoryOptions = useMemo(() => {
    return allCategories.map(({ category, id }) => ({
      label: category,
      value: id
    }))
  }, [allCategories])

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
    const questionIds = questionCategories
      .filter((qc) => qc.questionId)
      .map((qc) => qc.questionId)

    return allQuestions
      .filter((question) => {
        return questionIds.includes(question.id)
      }).filter((question) => {
        return !formik.values.introQuestionIds.includes(question.id)
      }).map((question) => {
        return {
          value: question.id,
          label: question.question
        }
      })
  }, [allQuestions, questionCategories, formik.values.introQuestionIds])

  const placeholderMessage = useMemo(() => {
    if (loadingQuestions) {
      return 'Loading questions...'
    }

    if (formik.values.introQuestionIds.length === 3) {
      return 'You can have up to 3 intro questions'
    }

    if (!selectedCategoryId) {
      return 'Select a category first'
    }

    if (questionOptions.length === 0) {
      return 'No questions to choose from'
    }

    return 'Select question...'
  }, [formik.values.introQuestionIds, questionOptions, selectedCategoryId, loadingQuestions])

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
        options={categoryOptions}
        placeholder="Select category..."
        onChange={(e) => setSelectedCategoryId(e.target.value)}
        value={selectedCategoryId}
      />
      <Select
        name="selectQuestion"
        label="Select up to three questions for the intro frame"
        options={questionOptions}
        placeholder={placeholderMessage}
        onChange={handleQuestionSelected}
        disabled={formik.values.introQuestionIds.length === 3}
        error={formik.touched.introQuestionIds ? formik.errors.introQuestionIds?.toString() : ''}
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
