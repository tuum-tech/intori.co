import type { NextPage } from 'next'
import BackButtonActionContainer from './back-button-action-container'

const HeaderContainerGroup: NextPage = () => {
  return (
    <div className='self-stretch flex flex-col items-start justify-start text-left text-base text-white-1 font-kumbh-sans'>
      <BackButtonActionContainer />
    </div>
  )
}

export default HeaderContainerGroup
