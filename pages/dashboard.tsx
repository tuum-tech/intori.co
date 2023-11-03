import BiDataCard from '@/components/common/BiDataCard'
import RecentCredentialsTable from '@/components/dashboard/RecentCredentialsTable'
import RequestAmazonHistory from '@/components/dashboard/RequestAmazonHistory'
import UserActivity from '@/components/dashboard/UserActivity'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import { useDid } from '@/contexts/DidContext'
import {
  AppStat,
  getTotalUsersFirebase
} from '@/lib/firebase/functions/getTotalUsers'
import { calculateTotalVCUSDValue } from '@/utils/credValue'
import type { GetServerSideProps, NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'
import SideNavigationMenu from '../components/side-navigation/SideNavigationMenu'

type Props = {
  initialAppStat: AppStat | null
}

const Dashboard: NextPage<Props> = ({ initialAppStat }) => {
  const [appStat, setAppStat] = useState<AppStat | null>(initialAppStat)

  const {
    state: { credentialRows }
  } = useDid()

  // Calculate the total value of all credentials
  const totalCredentialValue = useMemo(() => {
    return calculateTotalVCUSDValue(credentialRows)
  }, [credentialRows])

  useEffect(() => {
    if (!appStat) {
      // If for some reason the initial props didn't load, we can fetch them on client side as a fallback
      getTotalUsersFirebase().then(setAppStat).catch(console.error)
    }
  }, [appStat])

  // Ensure that appStat is defined before trying to access its properties
  if (!appStat) {
    return <div>Loading...</div> // Render a loading state or a placeholder
  }

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
              {/* <UniDataCard
                title='Earnings'
                titleContainers={[<DropdownFilter key='dropdown-filter' />]}
                value='$0.00'
                percentageChange='+0.00%'
              /> */}
              <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
                <BiDataCard
                  title='Total users'
                  value={appStat.totalUsers.toString()}
                  percentageChange='+0.00%'
                />
                <BiDataCard
                  title='Total VCs'
                  value={appStat.totalVCsCreated.toString()}
                  percentageChange='+0.00%'
                />
              </div>
              <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
                <BiDataCard
                  title='Portfolio Value'
                  value={`$${totalCredentialValue.toFixed(2)}`}
                  percentageChange='+0.00%'
                />
                <BiDataCard
                  title='Total Credentials'
                  value={`${credentialRows.length}`}
                />
              </div>
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const initialAppStat = await getTotalUsersFirebase()
    return { props: { initialAppStat } }
  } catch (error) {
    // Handle the error appropriately
    return {
      props: {
        initialAppStat: {
          totalUsers: 0,
          totalUploadedFiles: 0,
          totalVCsCreated: 0
        }
      }
    }
  }
}

export default Dashboard
