import DataCard from '@/components/common/DataCard'
import {
  CredentialDetail,
  VerifiableCredential
} from '@/components/credentials/CredRow'
import CredTable from '@/components/credentials/CredTable'
import SideNavigationMenu from '@/components/side-navigation/SideNavigationMenu'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import type { NextPage } from 'next'
import { useEffect } from 'react'

const Credentials: NextPage = () => {
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

  useEffect(() => {
    localStorage.setItem('credentials', JSON.stringify(credentialRows))
  }, [])

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
          <CredTable
            title='Your credentials'
            rows={credentialRows}
            isSelectable={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Credentials
