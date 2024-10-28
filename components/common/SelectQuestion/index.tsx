import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import Input from '../Input'
import { QuestionType } from '../../../models/questions'
import { QuestionCategoryType } from '../../../models/questionCategories'
import { createChannelQuestionFrameUrl } from '../../../utils/urls'
import { getAllQuestionsOfCategory } from '../../../requests/questionCategories'
import { Select } from '../Select'
import { useCategories } from '../../../contexts/useCategories'

type Props = {
  channelId: string
  questions: QuestionType[]
}

export const SelectQuestion: React.FC<Props> = ({ channelId, questions }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('')
  const [questionCategories, setQuestionCategories] = useState<QuestionCategoryType[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)

  const { allCategories } = useCategories()

  const selectedQuestion = useMemo(() => {
    return questions.find((question) => question.id === selectedQuestionId)
  }, [selectedQuestionId, questions])

  const channelQuestionFrameUrl = useMemo(() => {
    if (!selectedQuestionId) {
      return ''
    }

    return createChannelQuestionFrameUrl({
      channelId,
      questionId: selectedQuestionId
    })
  }, [channelId, selectedQuestionId])

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(channelQuestionFrameUrl)
    toast.success('Frame link copied to clipboard 😎')
  }

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

  const questionOptions = useMemo(() => {
    const questionIds = questionCategories
      .filter((qc) => qc.questionId)
      .map((qc) => qc.questionId)

    return questions
      .filter((question) => {
        return questionIds.includes(question.id)
      }).map((question) => {
        return {
          value: question.id,
          label: question.question
        }
      })
  }, [questions, questionCategories])

  const selectQuestionPlaceholderText = useMemo(() => {
    if (loadingQuestions) {
      return 'Loading questions...'
    }

    if (!selectedCategoryId) {
      return 'Select a category first'
    }

    return 'Select a question...'
  }, [selectedCategoryId, loadingQuestions])

  return (
    <>
      <Select
        name="selectCategory"
        label="Filter questions by a category"
        options={categoryOptions}
        placeholder="Select category..."
        onChange={(e) => setSelectedCategoryId(e.target.value)}
        value={selectedCategoryId}
      />

      <Select
        name="selectedQuestionId"
        label="Create a single question frame"
        disabled={!selectedCategoryId || loadingQuestions}
        options={questionOptions}
        onChange={(e) => setSelectedQuestionId(e.target.value)}
        value={selectedQuestionId}
        placeholder={selectQuestionPlaceholderText}
      />

      { selectedQuestion && (
        <Input
          label="Question Frame URL"
          value={channelQuestionFrameUrl}
          note="Click to copy to clipboard"
          onClick={copyUrlToClipboard}
          readOnly
        />
      )}
    </>
  )
}

