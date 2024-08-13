import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useFormik, FormikProvider, FieldArray} from 'formik'
import { QuestionType } from '../../models/questions'
import Input from '../../components/common/Input'
import {
  PrimaryButton,
  SecondaryButton,
  DangerButton
} from '../../components/common/Button'

import {
  updateQuestion,
  deleteQuestion,
  createQuestion
} from '../../requests/questions'

import { handleError } from '../../utils/handleError'

import styles from './styles.module.css'


const OneQuestion: React.FC<{
  initialQuestion: QuestionType
  onQuestionDeleted: (questionId: string) => void
  index: number
}> = ({
  initialQuestion,
  onQuestionDeleted,
  index
}) => {
  const formik = useFormik({
    initialValues: {
      ...initialQuestion
    },
    onSubmit: async (values) => {
      try {
        if (isNew) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...body } = values
          const res = await createQuestion(body)
          formik.setValues(res.data)
        } else {
          await updateQuestion(values.id, values)
        }
        toast.success('Question saved.')
      } catch (err) {
        handleError(err, 'Something went wrong updating this question. Please try again later.')
      }
    }
  })

  const isNew = useMemo(() => {
    return formik.values.id.startsWith('new-')
  }, [formik])

  const onDelete = async () => {
    try {
      if (!isNew) {
        await deleteQuestion(initialQuestion.id)
      }
      onQuestionDeleted(initialQuestion.id)
      toast.success('Question deleted.')
    } catch (err) {
        handleError(err, 'Something went wrong deleting this question. Please try again later.')
    }
  }

  return (
    <FormikProvider value={formik}>
      <form className={styles.question} onSubmit={formik.handleSubmit}>
        <div className={styles.indexNumber}>#{index}</div>
        <div className={styles.questionInput}>
          <Input
            label="Question"
            value={formik.values.question}
            name="question"
            onChange={formik.handleChange}
            required
          />
        </div>
        <details open={isNew}>
          <summary>Edit Question</summary>
          <div className={styles.columns}>
            <div className={styles.inputGroup}>
              <label htmlFor="answers">Answers</label>
              <FieldArray name="answers">
                {({ remove, push }) => (
                  <>
                    {
                      formik.values.answers.map((answer, index) => (
                        <div key={index} className={styles.inputRow}>
                          <Input
                            value={answer}
                            name={`answers.${index}`}
                            onChange={formik.handleChange}
                            required
                          />
                          <button type="button" onClick={() => remove(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                          </button>
                        </div>
                      ))
                    }

                    { formik.values.answers.length < 10 && (
                      <SecondaryButton onClick={() => push('')}>
                        Add Answer
                      </SecondaryButton>
                    )}
                  </>
                )}
              </FieldArray>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="categories">Categories</label>
              <FieldArray name="categories">
                {({ remove, push }) => (
                  <>
                    {
                      formik.values.categories.map((category, index) => (
                        <div key={index} className={styles.inputRow}>
                          <Input
                            value={category}
                            name={`categories.${index}`}
                            onChange={formik.handleChange}
                            required
                          />
                          <button type="button" onClick={() => remove(index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
                          </button>
                        </div>
                      ))
                    }
                    { formik.values.categories.length < 3 && (
                      <SecondaryButton onClick={() => push('')}>
                        Add Category
                      </SecondaryButton>
                    )}
                  </>
                )}
              </FieldArray>
            </div>
          </div>

          <div className={styles.actions}>
            <SecondaryButton onClick={() => formik.resetForm()}>
              Reset
            </SecondaryButton>

            <DangerButton onClick={onDelete}>
              Delete
            </DangerButton>

            <PrimaryButton type="submit">
              Save
            </PrimaryButton>
          </div>

        </details>
      </form>
    </FormikProvider>
  )
}

type Props = {
  questions: QuestionType[]
  onQuestionDeleted: (questionId: string) => void
}

export const DisplayQuestions: React.FC<Props> = ({
  questions,
  onQuestionDeleted
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Input
          value={searchTerm}
          name="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search questions"
        />
      </div>
      {
        questions.map((question, index) => {
          if (searchTerm && question.question.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1) {
            return null
          }

          return (
            <OneQuestion
              key={question.id}
              initialQuestion={question}
              onQuestionDeleted={onQuestionDeleted}
              index={questions.length - index}
            />
          )
        })
      }
    </div>
  )
}

