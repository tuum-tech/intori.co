import type { NextPage } from 'next'
import AmazonIconContainer from '../shared/amazon-icon-container'

const UploadItemDataTypeContainer: NextPage = () => {
  return (
    <div className='overflow-hidden flex flex-row items-start justify-start py-0 pr-[7px] pl-0 box-border gap-[20px] max-w-[500px] text-left text-xs text-white-0 font-kumbh-sans flex-1'>
      <AmazonIconContainer
        amazonIconContainerFlexShrink='0'
        amazonIconContainerWidth='46px'
        amazonIconContainerHeight='46px'
      />
      <div className='flex-1 overflow-hidden flex flex-col items-start justify-center gap-[5px]'>
        <div className='relative font-semibold'>Amazon Order</div>
        <div className='self-stretch relative text-white-1'>
          Classic Signature 1 x Auto Extreme Black Matt Spray Paint 400ml,
          Professional Quality, Perfect Finish for Cars.
        </div>
      </div>
    </div>
  )
}

export default UploadItemDataTypeContainer
