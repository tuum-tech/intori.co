import { NextPage } from 'next'
import WidgetTopTitleBarUploadData from '../top-navigation/widget-top-title-bar-upload-data'
import UploadDataRow from './UploadDataRow'
import CheckboxActionNullIconContaine from './checkbox-action-null-icon-container'
import Nodatauploads from './nodatauploads'

const DataTable: NextPage = () => {
  return (
    <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-xs text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4 Small_Tablet:hidden'>
      <WidgetTopTitleBarUploadData />
      <div className='self-stretch rounded-mini bg-black-2 flex flex-row items-center justify-start py-0 px-6 gap-[31px] text-left text-xs text-grey-1 font-kumbh-sans'>
        <CheckboxActionNullIconContaine checkboxActionNullIconConBoxSizing='border-box' />
        <div className='flex-1 h-6 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0 box-border'>
          <div className='relative font-semibold'>Data Type</div>
        </div>
        <div className='w-[333px] flex flex-row items-center justify-between Small_Tablet:flex'>
          <div className='relative font-semibold inline-block w-[70px] shrink-0'>
            Value
          </div>
          <div className='relative font-semibold inline-block w-[90px] shrink-0'>
            Purchased
          </div>
          <div className='relative font-semibold inline-block w-[90px] shrink-0'>
            Uploaded
          </div>
          <div className='rounded-mini' />;
        </div>
      </div>

      <div className='self-stretch flex flex-col items-start justify-start gap-[15px] text-center text-xs text-white-0 font-kumbh-sans'>
        <Nodatauploads />
        <UploadDataRow
          dataType='Amazon Order'
          value='$0.01'
          purchasedDate='21 Aug 2021'
          uploadedDate='01 Sep 2024'
          description='Classic Signature 1 x Auto Extreme Black Matt Spray Paint 400ml, Professional Quality, Perfect Finish for Cars.'
        />
      </div>
    </div>
  )
}

export default DataTable
