import type { NextPage } from 'next'
import CreateCredentialsContainer1 from '../uncategorized/create-credentials-container1'
import UploadDataContainer1 from '../upload/upload-data-container1'

type WidgetTopTitleBarUploadData1Type = {
  uploadIconContainer?: string
}

const WidgetTopTitleBarUploadData1: NextPage<
  WidgetTopTitleBarUploadData1Type
> = ({ uploadIconContainer }) => {
  return (
    <div className='h-14 flex flex-row items-center justify-start py-0 pr-0 pl-6 box-border gap-[20px] text-left text-3xl text-white-0 font-kumbh-sans self-stretch'>
      <div className='self-stretch flex-1 flex flex-row items-center justify-start Small_Tablet:flex'>
        <h1 className='m-0 relative text-inherit font-semibold font-inherit Small_Tablet:hidden'>
          Current data upload
        </h1>
      </div>
      <CreateCredentialsContainer1 />
      <UploadDataContainer1 uploadIconContainer='/uploadiconcontainer2.svg' />
    </div>
  )
}

export default WidgetTopTitleBarUploadData1
