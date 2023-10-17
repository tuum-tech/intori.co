import type { NextPage } from 'next'
import BottomSignInSectionContainer from './bottom-sign-in-section-container'
import MainInputContainer from './main-input-container'

const InputContentContainer: NextPage = () => {
  return (
    <div className='self-stretch flex flex-col items-start justify-start gap-[25px] text-left text-sm text-white-0 font-kumbh-sans'>
      <MainInputContainer />
      <BottomSignInSectionContainer />
    </div>
  )
}

export default InputContentContainer
