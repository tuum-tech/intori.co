import BiDataCard from '@/components/common/BiDataCard'
import DropdownFilter from '@/components/common/DropdownFilter'
import UniDataCard from '@/components/common/UniDataCard'
import {
  CredentialDetail,
  VerifiableCredential
} from '@/components/credentials/CredTypes'
import RecentCredentialsTable from '@/components/dashboard/RecentCredentialsTable'
import RequestAmazonHistory from '@/components/dashboard/RequestAmazonHistory'
import UserActivity from '@/components/dashboard/UserActivity'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import type { NextPage } from 'next'
import SideNavigationMenu from '../components/side-navigation/SideNavigationMenu'

const Dashboard: NextPage = () => {
  const credentialRows = [
    {
      id: 'AmazonOrder1',
      verifiableCredential: {
        name: 'The Brothers Karamazov',
        description: 'Sample description for ASIN: 374528373',
        category: 'TODO',
        store: 'Amazon',
        orderDate: '2013-05-07T21:00:21Z',
        amount: '$13.28',
        vcType: ['VerifiableCredential', 'OrderCredential'],
        vcIssuedBy:
          'did:pkh:eip155:1:0xbfecd5e5dff7f08b0a2eefe91bc9a7e492f54320',
        vcIssuedDate: '2023-10-20T14:28:31.000Z',
        vcExpiryDate: '2024-10-20T14:28:31.000Z'
      } as VerifiableCredential
    } as CredentialDetail,
    {
      id: 'AmazonOrder2',
      verifiableCredential: {
        name: 'Raspberry Pi Face',
        description: 'Sample description for ASIN: B00BBK072Y',
        category: 'TODO',
        store: 'Amazon',
        orderDate: '2013-05-19T14:29:25Z',
        amount: '$49.98',
        vcType: ['VerifiableCredential', 'OrderCredential'],
        vcIssuedBy:
          'did:pkh:eip155:1:0xbfecd5e5dff7f08b0a2eefe91bc9a7e492f54320',
        vcIssuedDate: '2023-10-20T14:28:31.000Z',
        vcExpiryDate: '2024-10-20T14:28:31.000Z'
      } as VerifiableCredential
    } as CredentialDetail
  ]

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
              <UniDataCard
                title='Earnings'
                titleContainers={[<DropdownFilter key='dropdown-filter' />]}
                value='$0.00'
                percentageChange='+0.00%'
              />
              <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
                <BiDataCard
                  title='Portfolio Value'
                  value='$0.00'
                  percentageChange='+0.00%'
                />
                <BiDataCard title='Total Credentials' value='0' />
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

export default Dashboard
