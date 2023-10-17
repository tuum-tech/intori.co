import type { NextPage } from 'next'
import IntoriLogoMarkIcon from './intori-logo-mark-icon'
import InputContentContainer from './input-content-container'
import SignInTitleContainer from './sign-in-title-container'

const SignInSectionContainer: NextPage = () => {
  return (
    <div className='self-stretch flex flex-col items-center justify-start py-0 px-3 gap-[24px] text-center text-11xl text-white-0 font-kumbh-sans lg:pl-3 lg:pr-3 lg:box-border md:pl-3 md:pr-3 md:box-border sm:pl-3 sm:pr-3 sm:box-border Small_Tablet:pl-3 Small_Tablet:pr-3 Small_Tablet:box-border'>
      <IntoriLogoMarkIcon />
      <SignInTitleContainer />
      <InputContentContainer />
    </div>
  )
}

export default SignInSectionContainer
