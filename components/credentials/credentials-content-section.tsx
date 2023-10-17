import type { NextPage } from 'next'
import TopNavBarContainer from '../top-navigation/top-nav-bar-container'
import CredWidgetDesktopList from './cred-widget-desktop-list'
import CredentialsWidgetMainContainer from './credentials-widget-main-container'

const CredentialsContentSection: NextPage = () => {
  return (
    <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-lg text-white-1 font-kumbh-sans'>
      <TopNavBarContainer />
      <CredentialsWidgetMainContainer />
      <CredWidgetDesktopList />
    </div>
  )
}

export default CredentialsContentSection
