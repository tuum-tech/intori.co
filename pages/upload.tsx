import BiDataCard from '@/components/common/BiDataCard'
import DataTable from '@/components/common/DataTable'
import SideNavigationMenu from '@/components/side-navigation/SideNavigationMenu'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import CreateCredentialsButton from '@/components/upload/CreateCredentialsButton'
import UploadDataButton from '@/components/upload/UploadDataButton'
import {
  OrderData,
  UploadedDataDetail
} from '@/components/upload/UploadedTypes'
import type { NextPage } from 'next'

const Upload: NextPage = () => {
  const uploadedDataRows = [
    {
      id: 'AmazonOrder1',
      orderData: {
        name: 'The Brothers Karamazov',
        description: 'Sample description for ASIN: 374528373',
        store: 'Amazon',
        purchasedDate: '2021-01-05T14:28:31.000Z',
        uploadedDate: '2022-05-20T14:28:31.000Z',
        amount: '$13.28'
      } as OrderData
    } as UploadedDataDetail,
    {
      id: 'AmazonOrder2',
      orderData: {
        name: 'Raspberry Pi Face',
        description: 'Sample description for ASIN: B00BBK072Y',
        store: 'Amazon',
        purchasedDate: '2021-08-09T14:28:31.000Z',
        uploadedDate: '2022-04-20T14:28:31.000Z',
        amount: '$49.98'
      } as OrderData
    } as UploadedDataDetail
  ]

  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu />
      <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-lg text-white-1 font-kumbh-sans'>
        <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-lg text-white-1 font-kumbh-sans'>
          <TopNavigationMenu />
          <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
            <BiDataCard title='Data Value' value='$0.00' />
            <BiDataCard title='Items Selected' value='0/0' />
          </div>
          <DataTable
            title='Current data upload'
            titleContainers={[
              <CreateCredentialsButton key='create-credentials-button' />,
              <UploadDataButton key='upload-data-button' />
            ]}
            isCredentialType={false}
            rows={uploadedDataRows}
            isSelectable={true}
          />
        </div>
      </div>
    </div>
  )
}

export default Upload
