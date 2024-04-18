import type { NextPage } from "next";
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useEffect, useMemo } from "react";

import BiDataCard from "@/components/common/BiDataCard";
import UniDataCard from "@/components/common/UniDataCard";
import RecentCredentialsTable from "@/components/dashboard/RecentCredentialsTable";
import UserActivity from "@/components/dashboard/UserActivity";
import { AppLayout } from "@/layouts/App"

const Dashboard: NextPage = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/')
    }
  }, [session, router])

  const loading = useMemo(() => session.status === 'loading', [session])

  if (loading || !session?.data?.user) {
    return (
      <AppLayout title="Launching...">
        <sub>One moment please...</sub>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={`Welcome ${session.data.user.name}!`}>
      <p>
        FID: {session.data.user.fid}
      </p>
      <div className="flex-1 flex flex-col items-start justify-start gap-[24px] md:flex-[unset] md:self-stretch">
        <div className="self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans">
          <BiDataCard
            title="Total users"
            value="Test"
            // percentageChange='+0.00%'
          />
          <BiDataCard
            title="Total Credentials"
            value="1000"
            // percentageChange='+0.00%'
          />
        </div>
        <div className="self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans">
          <BiDataCard
            title="Total Files Processed"
            value="1234"
            // percentageChange="+0.00%"
          />
          <BiDataCard
            title="Total Orders Processed"
            value="1234"
            // percentageChange="+0.00%"
          />
        </div>
        <UniDataCard
          title="Portfolio"
          value="1234.00"
          percentageChange={`2 credentials`}
        />
        <RecentCredentialsTable rows={[]} />
      </div>

      <div className="self-stretch w-[380px] flex flex-col items-start justify-start text-left text-sm text-white-0 font-kumbh-sans md:self-stretch md:w-auto Small_Tablet:self-stretch Small_Tablet:w-auto">
        <UserActivity />
      </div>
    </AppLayout>
  )
}

export default Dashboard;
