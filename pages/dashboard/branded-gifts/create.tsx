import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"
import Link from "next/link"
import { useFormik } from "formik"

// components
import { AppLayout } from "@/layouts/App"
import { Section } from "@/components/common/Section"
import { PrimaryButton } from "@/components/common/Button"
import Input from "@/components/common/Input"

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
  const formik = useFormik({
    initialValues: {
      brandUserFid: 0,
      giftUrl: "",
      targetTopic: ""
    },
    onSubmit: (values) => {

    }
  })

  return (
    <AppLayout>
      <Section
        title="Create a Branded Gift"
        subtitle="Here you can create a new branded gift for a 'brand user'"
      >
        <Link href="/dashboard/branded-gifts">
          <PrimaryButton>
            Back
          </PrimaryButton>
        </Link>

        <Input
          label="Brand User FID"
          placeholder="897"
          value={formik.values.brandUserFid.toString()}
          onChange={formik.handleChange}
        />
      </Section>
    </AppLayout>
  )
}

export default CreateBrandedGift
