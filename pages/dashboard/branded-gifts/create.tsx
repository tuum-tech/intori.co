import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"
import { useFormik } from "formik"
import * as yup from "yup"
import { toast } from "react-toastify"

import { AppLayout } from "@/layouts/App"
import { Section } from "@/components/common/Section"
import { PrimaryButton } from "@/components/common/Button"
import { FormActions } from "@/components/common/Form"
import Input from "@/components/common/Input"
import Textarea from "@/components/common/Textarea"
import { SelectTopicDropdown } from "@/components/Questions/SelectTopicDropdown"
import { TopicStats } from "@/components/TopicStats"
import { useCreateBrandedGift } from "@/hooks/useBrandedGifts"

import { handleError } from "@/utils/handleError"

export const getServerSideProps = (async (context) => {
  const session = await getSession(context)

  if (!session?.user?.fid || !session.admin) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  return {
    props: {}
  }
}) satisfies GetServerSideProps

const CreateBrandedGift: NextPage = () => {
  const createBrandedGiftMutation = useCreateBrandedGift()

  const formik = useFormik({
    initialValues: {
      giftUrl: "",
      message: "",
      targetTopic: ""
    },
    validationSchema: yup.object({
      giftUrl: yup.string().url("Invalid URL").required("Required"),
      message: yup.string().max(300, "Message is too long").required("Required"),
      targetTopic: yup.string().required("Required")
    }),
    onSubmit: async (values) => {
      try {
        const result = await createBrandedGiftMutation.mutateAsync({
          giftUrl: values.giftUrl,
          message: values.message,
          targetTopic: values.targetTopic
        })

        if (result.success) {
          toast.success('Branded gift submitted successfully!')
          formik.resetForm()
        } else {
          toast.error(`Error: ${result.error}`)
        }
      } catch (error) {
        handleError(error, 'Failed to create branded gift. Please try again.')
      }
    }
  })

  const handleTopicSelected = (topic: string) => {
    formik.setFieldValue("targetTopic", topic)
  }

  return (
    <AppLayout>
      <Section
        title="Create a Sponsored Gift"
        subtitle="Here you can create a new sponsored gift"
      >
        <SelectTopicDropdown
          label="Select Target Topic"
          onTopicSelected={handleTopicSelected}
        />

        <TopicStats topic={formik.values.targetTopic} />

        <Input
          label="Enter the URL you want your audience to view"
          placeholder="e.g. https://www.intori.co/"
          value={formik.values.giftUrl}
          onChange={(e) => formik.setFieldValue("giftUrl", e.target.value)}
        />

        <Textarea
          label="Enter a custom message to display to your audience"
          placeholder="e.g. Hello from Intori! Check out our Farcaster Mini App."
          value={formik.values.message}
          onChange={(e) => formik.setFieldValue("message", e.target.value)}
        />

        <FormActions>
          <PrimaryButton 
            onClick={() => formik.handleSubmit()}
            disabled={createBrandedGiftMutation.isPending}
          >
            {createBrandedGiftMutation.isPending ? 'Creating...' : 'Submit'}
          </PrimaryButton>
        </FormActions>
      </Section>
    </AppLayout>
  )
}

export default CreateBrandedGift
