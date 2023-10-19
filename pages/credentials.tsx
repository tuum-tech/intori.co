import DataCard from '@/components/common/DataCard'
import DataTable from '@/components/common/DataTable'
import SideNavigationMenu from '@/components/side-navigation/SideNavigationMenu'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import type { NextPage } from 'next'

const Credentials: NextPage = () => {
  const credentialRows = [
    {
      id: 'AmazonOrder1',
      credentialOrDataType: 'OrderCredential',
      value: '$1',
      issuedOrPurchasedDate: '05 Jan 2021',
      expireOrUploadedDate: '26 Feb 2027',
      description: 'Amazon'
    },
    {
      id: 'AmazonOrder2',
      credentialOrDataType: 'OrderCredential',
      value: '$2',
      issuedOrPurchasedDate: '21 Aug 2019',
      expireOrUploadedDate: '01 Sep 2024',
      description: 'Amazon'
    }
  ]

  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu />
      <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-lg text-white-1 font-kumbh-sans'>
        <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-lg text-white-1 font-kumbh-sans'>
          <TopNavigationMenu />
          <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
            <DataCard
              title='Total Credential Value'
              value='$0.00'
              percentageChange='+0.00%'
            />
            <DataCard title='Total Credentials' value='0' />
          </div>
          <DataTable
            title='Your credentials'
            isCredentialType={true}
            dataRows={credentialRows}
            isSelectable={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Credentials
