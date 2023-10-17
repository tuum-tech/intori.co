import type { NextPage } from 'next'
import TopNavBarContainer from '../top-navigation/top-nav-bar-container'
import MiddleDashboardContainer from './middle-dashboard-container'
import WelcomeHeaderContentContainer from './welcome-header-content-container'

const OverviewContentSection: NextPage = () => {
  return (
    <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-13xl text-white-0 font-kumbh-sans'>
      <TopNavBarContainer />
      <WelcomeHeaderContentContainer />
      <MiddleDashboardContainer />
    </div>
  )
}

export default OverviewContentSection
