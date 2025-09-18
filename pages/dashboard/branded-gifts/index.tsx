import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"
import Link from "next/link"

// components
import { AppLayout } from "@/layouts/App"
import { Section } from "@/components/common/Section"
import { PrimaryButton } from "@/components/common/Button"

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

const BrandedGifts: NextPage = () => {
  return (
    <AppLayout>
      <Section
        title="Branded Gifts"
        subtitle="Here you can manage branded gifts."
      >
        <Link href="/dashboard/branded-gifts/create">
          <PrimaryButton>
            Create Branded Gift
          </PrimaryButton>
        </Link>
      </Section>
    </AppLayout>
  )
}

export default BrandedGifts
