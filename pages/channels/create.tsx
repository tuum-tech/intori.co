import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import type { NextPage, GetServerSideProps } from "next";
import { useRouter } from 'next/router'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { getSession } from "next-auth/react"
import { CreateChannelFrameType } from "../../models/channelFrames"

// components
import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import { PrimaryButton } from '../../components/common/Button'
import Input from '../../components/common/Input'
import { SelectIntroQuestions } from '../../components/common/SelectIntroQuestions'
import { FormActions } from '../../components/common/Form'
import { createChannelFrame } from '../../requests/channelFrames'
import { QuestionType, getAllQuestions } from '../../models/questions'

type Props = {
  allQuestions: QuestionType[]
}
export const getServerSideProps = (async (context) => {
  const session = await getSession(context)

  if (!session?.user?.fid) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    }
  }

  const allQuestions = await getAllQuestions()

  allQuestions.sort((a, b) => {
    return a.question.localeCompare(b.question)
  })

  return {
    props: {
      allQuestions
    }
  }
}) satisfies GetServerSideProps<Props>

const CreateChannelFrame: NextPage<Props> = ({ allQuestions }) => {
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      channelId: '',
      introQuestionIds: []
    } as CreateChannelFrameType,

    validationSchema: yup.object({
      channelId: yup.string().required('Channel ID is required'),
      introQuestionIds: yup.array().of(
        yup.string().required('Question is required.')
      ).max(3, 'No more than 3 intro questions.').required('At least one intro question is required.')
    }),

    onSubmit: async (values) => {
      try {
        await createChannelFrame(values)
        toast.success('🚀 Channel frame created!')
        router.push('/channels')
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.error || error.message)
        } else {
          toast.error('Something went wrong creating this channel frame. Please try again.')
        }
      }
    }
  })

  return (
    <AppLayout>
      <Section
        title="Create Channel Frame"
        subtitle="You can create your own Intori frame for your channel here."
      >
        <form onSubmit={formik.handleSubmit}>
          <Input
            name="channelId"
            label="Channel ID"
            placeholder="e.g. /tabletop, /base, /farcaster"
            value={formik.values.channelId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.channelId ? formik.errors.channelId : ''}
            note="You must be the owner to create a frame for this channel."
            required
          />

          { /* <SelectQuestionCategoryInput formik={formik} /> */ }
          <SelectIntroQuestions formik={formik} allQuestions={allQuestions} />

          <FormActions>
            <PrimaryButton type="submit">Create Channel Frame</PrimaryButton>
          </FormActions>
        </form>
      </Section>
    </AppLayout>
  )
}

export default CreateChannelFrame
