import type { NextPage } from 'next'
import AmazonIconContainer from '../shared/amazon-icon-container'
import MoreDotsIconActionContainer from '../shared/more-dots-icon-action-container'
import CheckboxActionNullIconContaine from './checkbox-action-null-icon-container'

const DataUploadItemMobile: NextPage = () => {
  return (
    <div className='rounded-mini flex flex-row items-start justify-start py-3 px-6 box-border gap-[31px] text-left text-xs text-white-0 font-kumbh-sans self-stretch'>
      <div className='self-stretch flex flex-row items-start justify-start Small_Tablet:flex'>
        <CheckboxActionNullIconContaine checkboxActionNullIconConBoxSizing='border-box' />
      </div>
      <div className='flex-1 flex flex-col items-start justify-start gap-[24px]'>
        <div className='self-stretch overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0'>
          <div className='flex-1 overflow-hidden flex flex-col items-start justify-start py-0 pr-[7px] pl-0 gap-[20px]'>
            <AmazonIconContainer
              amazonIconContainerFlexShrink='0'
              amazonIconContainerWidth='56px'
              amazonIconContainerHeight='56px'
            />
            <div className='self-stretch overflow-hidden flex flex-col items-start justify-center gap-[5px]'>
              <div className='relative font-semibold'>Amazon Order</div>
              <div className='self-stretch relative leading-[22px] text-white-1'>
                Classic Signature 1 x Auto Extreme Black Matt Spray Paint 400ml,
                Professional Quality, Perfect Finish for Cars.
              </div>
            </div>
          </div>
        </div>
        <div className='self-stretch flex flex-col items-start justify-start gap-[14px] text-grey-1 Small_Tablet:flex'>
          <div className='flex flex-row items-start justify-start gap-[24px]'>
            <div className='relative font-semibold inline-block w-[90px] shrink-0'>
              Value
            </div>
            <div className='relative text-white-1'>$0.01</div>
          </div>
          <div className='flex flex-row items-start justify-start gap-[24px]'>
            <div className='relative font-semibold inline-block w-[90px] shrink-0'>
              Purchased
            </div>
            <div className='relative text-white-1 inline-block w-[90px] shrink-0'>
              21 Aug 2021
            </div>
          </div>
          <div className='flex flex-row items-start justify-start gap-[24px]'>
            <div className='relative font-semibold inline-block w-[90px] shrink-0'>
              Uploaded
            </div>
            <div className='relative text-white-1 inline-block w-[90px] shrink-0'>
              01 Sep 2024
            </div>
          </div>
        </div>
      </div>
      <MoreDotsIconActionContainer moreDotsIconActionContainBoxSizing='border-box' />
    </div>
  )
}

export default DataUploadItemMobile
