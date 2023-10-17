import type { NextPage } from 'next'
import AmazonIconContainer from '../shared/amazon-icon-container'
import MoreDotsIconActionContainer from '../shared/more-dots-icon-action-container'

const RecentCredentialDesktop: NextPage = () => {
  return (
    <div className='self-stretch rounded-mini flex flex-row items-start justify-start py-3 px-6 gap-[31px] text-left text-xs text-white-0 font-kumbh-sans'>
      <div className='flex-1 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0'>
        <div className='flex-1 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0 box-border gap-[20px] max-w-[500px]'>
          <AmazonIconContainer
            amazonIconContainerFlexShrink='0'
            amazonIconContainerWidth='56px'
            amazonIconContainerHeight='56px'
          />
          <div className='flex-1 overflow-hidden flex flex-col items-start justify-center gap-[5px]'>
            <div className='relative font-semibold'>Order Credential</div>
            <div className='self-stretch relative font-medium text-white-1'>
              Amazon
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-row items-center justify-start gap-[24px] text-white-1 Small_Tablet:flex'>
        <div className='relative inline-block w-[70px] shrink-0'>$0.01</div>
        <MoreDotsIconActionContainer moreDotsIconActionContainBoxSizing='border-box' />
      </div>
    </div>
  )
}

export default RecentCredentialDesktop
