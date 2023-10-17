import type { NextPage } from 'next'
import MainDataDashboardContent from './main-data-dashboard-content'
import OverviewRightBarContainer from './overview-right-bar-container'

const MiddleDashboardContainer: NextPage = () => {
  return (
    <div className='self-stretch flex flex-row items-start justify-start gap-[24px] text-left text-lg text-white-1 font-kumbh-sans md:flex-col'>
      <MainDataDashboardContent />
      <OverviewRightBarContainer />
    </div>
  )
}

export default MiddleDashboardContainer
