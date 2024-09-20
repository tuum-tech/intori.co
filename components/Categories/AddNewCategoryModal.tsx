import React from 'react'
import { useFormik } from 'formik'
import { Modal, ModalFooter } from '@/components/common/Modal'
import { useCategories } from '@/contexts/useCategories'
import Input from '@/components/common/Input'
import { PrimaryButton, SecondaryButton } from '@/components/common/Button'

type Props = {
  show: boolean
  onClose: () => void
}

export const AddNewCategoryModal: React.FC<Props> = ({
  show,
  onClose
}) => {
  const { addCategory } = useCategories()

  const formik = useFormik({
    initialValues: {
      category: ''
    },
    onSubmit: async (values, formik) => {
      console.log({ values })
      await addCategory(values.category)
      formik.resetForm()
      onClose()
    }
  })

  const handleClose = () => {
    if (formik.isSubmitting) {
      return
    }
    formik.resetForm()
    onClose()
  }

  return (
    <Modal title="Add New Category" isOpen={show} onClose={handleClose}>
      <form onSubmit={formik.handleSubmit}>
        <Input
          name="category"
          label="Category"
          placeholder="e.g. Movies"
          required
          onChange={formik.handleChange}
          value={formik.values.category}
        />
        <ModalFooter>
          <SecondaryButton onClick={handleClose}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={formik.isSubmitting}>
            Submit
          </PrimaryButton>
        </ModalFooter>
      </form>
    </Modal>
  )
}
