import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "next-auth/react"

// components
import { AppLayout } from "@/layouts/App"
import { Section } from "@/components/common/Section"
import { IntoriPlusApplicationsTable } from "@/components/IntoriPlusApplicationsTable"
import { IntoriPlusStats } from "@/components/IntoriPlusStats"

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

const IntoriPlus: NextPage = () => {
  return (
    <AppLayout>
      <Section title="Intori Plus Applications">
        <IntoriPlusStats />
        <IntoriPlusApplicationsTable />
      </Section>
    </AppLayout>
  )
}

export default IntoriPlus
