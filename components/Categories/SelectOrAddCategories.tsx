import React, { useMemo } from 'react'
import { useCategories } from '../../contexts/useCategories'
import { useQuestionCategories } from '../../contexts/useQuestionCategories'
import { Select } from '../common/Select'
import { OneCategoryTag } from '@/components/Categories/OneCategoryTag'

type Props = {
  questionId: string
}
export const SelectOrAddCategoriesForQuestion: React.FC<Props> = ({ questionId }) => {
  const { allCategories, showAddCategoryModal } = useCategories()
  const {
    questionCategories,
    createQuestionCategory,
    removeQuestionCategory
  } = useQuestionCategories()

  const categoriesForThisQuestion = useMemo(() => {
    return questionCategories.filter((qc) => qc.questionId === questionId)
  }, [questionCategories, questionId])

  const options = useMemo(() => {
    const categoryOptions = allCategories.map(({ category, id }) => {
      return {
        label: category,
        value: id
      }
    })

    categoryOptions.unshift({
      value: 'add',
      label: 'Add new category...'
    })

    return (
      categoryOptions
        .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
        .filter((option) => {
          return !categoriesForThisQuestion.find(c => c.categoryId === option.value)
        })
    )
  }, [allCategories, categoriesForThisQuestion])

  const onCategorySelected = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    if (value === 'add') {
      return showAddCategoryModal()
    }

    await createQuestionCategory({
      categoryId: value,
      questionId
    })
  }

  return (
    <>
      {categoriesForThisQuestion.map((category) => (
        <OneCategoryTag
          key={`${questionId}-${category.categoryId}`}
          categoryId={category.categoryId}
          onRemove={(categoryId) => removeQuestionCategory({ categoryId, questionId })}
        />
        ))}
      { categoriesForThisQuestion.length < 3 && (
        <Select
          options={options}
          label="Add a Category"
          name="categories"
          onChange={onCategorySelected}
          value=""
          placeholder="Select..."
        />
      )}
    </>
  )
}
