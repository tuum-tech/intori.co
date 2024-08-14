import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { FormikContextType } from 'formik'
import { CreateChannelFrameType } from '../../../models/channelFrames'
import { getQuestionCategories } from '../../../requests/questions'
import { Select } from '../Select'

type Props = {
  formik: FormikContextType<CreateChannelFrameType>
}

export const SelectQuestionCategoryInput: React.FC<Props> = ({ formik }) => {
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchQuestionCategories = async () => {
      try {
        const res = await getQuestionCategories()
        setAvailableCategories(res.data)
      } catch (err) {
        toast.error('Something went wrong loading question categories. Please try again later.')
      }

      setLoadingCategories(false)
    }

    fetchQuestionCategories()
  }, [])

  const options = useMemo(() => {
    if (!availableCategories) {
      return []
    }

    return availableCategories.map(category => ({
      label: category,
      value: category
    }))
  }, [availableCategories])

  return (
    <Select
      formik={formik}
      label="Filter Questions by Category"
      name="category"
      options={options}
      placeholder={loadingCategories ? 'Loading categories...' : 'Select a question category...'}
    />
  )
}

