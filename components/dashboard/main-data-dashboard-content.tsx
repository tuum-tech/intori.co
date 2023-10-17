import type { NextPage } from 'next'
import OverviewWidgetMainContainer from './overview-widget-main-container'
import RecentCredWidgetDesktop from './recent-cred-widget-desktop'
import RequestAmazonHistoryCard from './request-amazon-history-card'
import YourEarningsWidget from './your-earnings-widget'

const MainDataDashboardContent: NextPage = () => {
  return (
    <div className='flex-1 flex flex-col items-start justify-start gap-[24px] text-left text-lg text-white-1 font-kumbh-sans md:flex-[unset] md:self-stretch'>
      <RequestAmazonHistoryCard />
      <YourEarningsWidget />
      <OverviewWidgetMainContainer />
      <RecentCredWidgetDesktop />
    </div>
  )
}

export default MainDataDashboardContent
