import type { NextPage } from 'next'
import DataCard from '../common/DataCard'
import PortfolioValueWidget from './portfolio-value-widget'

const OverviewWidgetMainContainer: NextPage = () => {
  return (
    <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
      <PortfolioValueWidget />
      <DataCard title='Total Credentials' value='0' />
    </div>
  )
}

export default OverviewWidgetMainContainer
