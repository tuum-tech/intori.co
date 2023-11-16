import BiDataCard from '@/components/common/BiDataCard'
import UniDataCard from '@/components/common/UniDataCard'
import { CredentialDetail } from '@/components/credentials/CredTypes'
import RecentCredentialsTable from '@/components/dashboard/RecentCredentialsTable'
import RequestAmazonHistory from '@/components/dashboard/RequestAmazonHistory'
import UserActivity from '@/components/dashboard/UserActivity'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import {
  TotalStats,
  getUserStatsFirebase
} from '@/lib/firebase/functions/getUserStats'
import { getVCsFirebase } from '@/lib/firebase/functions/getVCs'
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import SideNavigationMenu from '../components/side-navigation/SideNavigationMenu'

const Dashboard: NextPage = () => {
  const [totalStats, setTotalStats] = useState<TotalStats>({
    totalUsers: 0,
    userStats: {
      uploadedFiles: 0,
      ordersProcessed: 0,
      vcsCreated: 0,
      vcsValue: 0
    },
    appStats: {
      uploadedFiles: 0,
      ordersProcessed: 0,
      vcsCreated: 0,
      vcsValue: 0
    }
  })

  const [credentialRows, setCredentialRows] = useState([] as CredentialDetail[])
  const isCredentialsFetched = useRef(false)

  useEffect(() => {
    const refreshStats = async () => {
      setTotalStats(await getUserStatsFirebase())
    }
    refreshStats()
  }, [credentialRows])

  const fetchCredentials = async () => {
    const itemsPerPage = 5
    const vcs = await getVCsFirebase({
      self: true,
      query: {},
      itemsPerPage,
      startAfterDoc: null,
      fetchEverything: false
    })
    if (vcs.length > 0) {
      setCredentialRows((prevState) => [...prevState, ...vcs])
    }
  }

  useEffect(() => {
    const fetchAndProcessCredentials = async () => {
      if (!isCredentialsFetched.current) {
        isCredentialsFetched.current = true
        await fetchCredentials() // Wait for fetchCredentials to complete
        isCredentialsFetched.current = false
      }
    }

    fetchAndProcessCredentials()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu />
      <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-13xl text-white-0 font-kumbh-sans'>
        <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-13xl text-white-0 font-kumbh-sans'>
          <TopNavigationMenu />
          <div className='self-stretch h-14 flex flex-col items-start justify-center text-left text-13xl text-white-0 font-kumbh-sans md:pl-3 md:box-border'>
            <div className='flex flex-row items-center justify-start Small_Tablet:flex'>
              <h1 className='m-0 relative text-inherit font-semibold font-inherit Small_Tablet:flex'>
                Welcome
              </h1>
            </div>
          </div>
          <div className='self-stretch flex flex-row items-start justify-start gap-[24px] text-left text-lg text-white-1 font-kumbh-sans md:flex-col'>
            <div className='flex-1 flex flex-col items-start justify-start gap-[24px] text-left text-lg text-white-1 font-kumbh-sans md:flex-[unset] md:self-stretch'>
              <RequestAmazonHistory />
              <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
                <BiDataCard
                  title='Total users'
                  value={totalStats.totalUsers}
                  percentageChange='+0.00%'
                />
                <BiDataCard
                  title='Total Credentials'
                  value={totalStats.appStats.vcsCreated}
                  percentageChange='+0.00%'
                />
              </div>
              <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
                <BiDataCard
                  title='Total Files Processed'
                  value={totalStats.appStats.uploadedFiles}
                  percentageChange='+0.00%'
                />
                <BiDataCard
                  title='Total Orders Processed'
                  value={totalStats.appStats.ordersProcessed}
                  percentageChange='+0.00%'
                />
              </div>
              <UniDataCard
                title='Portfolio'
                // titleContainers={[<DropdownFilter key='dropdown-filter' />]}
                value={`$${totalStats.userStats.vcsValue.toFixed(2)}`}
                percentageChange={`${totalStats.userStats.vcsCreated} credentials`}
              />
              <RecentCredentialsTable rows={credentialRows} />
            </div>
            <div className='self-stretch w-[380px] flex flex-col items-start justify-start text-left text-sm text-white-0 font-kumbh-sans md:self-stretch md:w-auto Small_Tablet:self-stretch Small_Tablet:w-auto'>
              <UserActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
