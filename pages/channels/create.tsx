import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import type { NextPage, GetServerSideProps } from "next";
import * as yup from 'yup'
import { useFormik } from 'formik'
import { getSession } from "next-auth/react"
import { CreateChannelFrameType } from "../../models/channelFrames"

// components
import { AppLayout } from "@/layouts/App"
import { Section } from '../../components/common/Section'
import { PrimaryButton } from '../../components/common/Button'
import Input from '../../components/common/Input'
import { RadioGroup } from '../../components/common/RadioGroup'
import { SelectQuestionCategoryInput } from '../../components/common/SelectQuestionCategoryInput'
import { SelectIntroQuestions } from '../../components/common/SelectIntroQuestions'
import { FormActions } from '../../components/common/Form'
import { createChannelFrame } from '../../requests/channelFrames'

const channelFramePostScheduleOptions = [
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bimonthly', label: 'Bimonthly' },
  { value: 'monthly', label: 'Monthly' }
]

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

  return {
    props: {}
  }
}) satisfies GetServerSideProps

const CreateChannelFrame: NextPage = ({}) => {
  const formik = useFormik({
    initialValues: {
      channelId: '',
      category: '',
      introQuestions: [],
      postSchedule: 'biweekly'
    } as CreateChannelFrameType,
    validationSchema: yup.object({
      channelId: yup.string().required('Channel ID is required'),
      category: yup.string().required('Category is required'),
      introQuestions: yup.array().required('Intro questions are required'),
      postSchedule: yup.string().required('Post schedule is required')
    }),
    onSubmit: async (values) => {
      try {
        await createChannelFrame(values)
        window.location.href = '/channels'
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
          <SelectQuestionCategoryInput formik={formik} />
          <RadioGroup
            label="Channel Post Schedule"
            formik={formik}
            options={channelFramePostScheduleOptions}
            name="postSchedule"
          />
          <SelectIntroQuestions formik={formik} />

          <FormActions>
            <PrimaryButton type="submit">Create Channel Frame</PrimaryButton>
          </FormActions>
        </form>
      </Section>
    </AppLayout>
  )
}

export default CreateChannelFrame
