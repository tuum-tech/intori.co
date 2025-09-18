import { useState, useEffect } from "react"
import * as yup from "yup"
import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"
import { useFormik } from "formik"
import { toast } from "react-toastify"

// components
import { AppLayout } from "@/layouts/App"
import { Section } from "@/components/common/Section"
import { PrimaryButton, SecondaryButton } from "@/components/common/Button"
import { Modal, ModalFooter } from "@/components/common/Modal"
import Input from "@/components/common/Input"
import { SponsorsTable } from "@/components/SponsorsTable"

// hooks
import { useAddSponsor } from "@/hooks/useSponsors"

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

const Sponsors: NextPage = () => {
  const [addingSponsor, setAddingSponsor] = useState(false)
  const addSponsorMutation = useAddSponsor()

  const formik = useFormik({
    initialValues: {
      fid: undefined
    },
    validationSchema: yup.object({
      fid: yup.number().min(1).required("FID is required")
    }),
    onSubmit: async (values) => {
      try {
        await addSponsorMutation.mutateAsync({ fid: Number(values.fid) })
        toast.success('Sponsor added successfully!')
        setAddingSponsor(false)
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Failed to add sponsor'
        toast.error(errorMessage)
      }
    }
  })

  useEffect(() => {
    if (!addingSponsor) {
      formik.resetForm()
    }
  }, [addingSponsor, formik])

  return (
    <>
      <Modal
        isOpen={addingSponsor}
        onClose={() => setAddingSponsor(false)}
        title="Add Sponsor Account"
      >
        <Input
          label="Please enter FID of the sponsor Farcaster account"
          name="fid"
          value={(formik.values.fid ?? "").toString()}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.fid ? formik.errors.fid : undefined}
        />

        <ModalFooter>
          <SecondaryButton onClick={() => setAddingSponsor(false)}>
            Cancel
          </SecondaryButton>
          <PrimaryButton 
            onClick={() => formik.submitForm()}
            disabled={addSponsorMutation.isPending}
          >
            {addSponsorMutation.isPending ? 'Adding...' : 'Submit'}
          </PrimaryButton>
        </ModalFooter>
      </Modal>

      <AppLayout>
        <Section
          title="Sponsor Accounts"
          subtitle="These accounts are allowed to login and create branded gifts"
        >
          <PrimaryButton onClick={() => setAddingSponsor(true)}>
            Add Sponsor
          </PrimaryButton>
          <SponsorsTable />
        </Section>
      </AppLayout>
    </>
  )
}

export default Sponsors
