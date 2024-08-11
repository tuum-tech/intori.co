import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FormikContextType } from 'formik'
import { CreateChannelFrameType } from '../../../models/channelFrames'
import { QuestionType } from '../../../models/questions'
import { getQuestionsByCategory } from '../../../requests/questions'
import styles from './styles.module.css'
import selectStyles from '../Select/styles.module.css'

type Props = {
  formik: FormikContextType<CreateChannelFrameType>
}

export const SelectIntroQuestions: React.FC<Props> = ({
  formik
}) => {
  const [availableQuestions, setAvailableQuestions] = useState<QuestionType[]>([])

  const handleQuestionSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQuestion = availableQuestions.find((question) => question.id === e.target.value)
    if (selectedQuestion) {
      formik.setFieldValue('introQuestions', [...formik.values.introQuestions, selectedQuestion.question])
      setAvailableQuestions(availableQuestions.filter((question) => question.id !== e.target.value))
    }
  }

  useEffect(() => {
    setAvailableQuestions([])
    formik.setFieldValue('introQuestions', [])

    const fetchQuestions = async () => {
      try {
        const res = await getQuestionsByCategory(formik.values.category)
        setAvailableQuestions(res.data)
      } catch (err) {
        toast.error('Failed to fetch questions for this category. Please try again later.')
        setAvailableQuestions([])
      }
    }

    fetchQuestions()
  }, [formik.values.category])

  return (
    <div className={styles.introQuestionsContainer}>
      {formik.values.introQuestions.length < 3 && (
        <div className={selectStyles.selectContainer}>
          <label htmlFor="selectQuestion">
            Select up to three questions for the intro frame
          </label>
          <select value="" onChange={handleQuestionSelected} name="selectQuestion">
              <option value="" disabled selected>
                { availableQuestions.length === 0
                  ? 'No questions to choose from'
                  : 'Select question...'
                }
              </option>
              {availableQuestions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.question}
                </option>
              ))}
          </select>
        </div>
      )}
      <ol>
        {
          formik.values.introQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))
        }
      </ol>
    </div>
  )
}

