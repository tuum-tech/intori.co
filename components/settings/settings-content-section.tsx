import type { NextPage } from 'next'
import TopNavBarContainer from '../top-navigation/top-nav-bar-container'
import SettingsWidgetBlock from './settings-widget-block'
import TopTitleSettingsContainerSection from './top-title-settings-container-section'

const SettingsContentSection: NextPage = () => {
  return (
    <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-base text-white-0 font-kumbh-sans'>
      <TopNavBarContainer />
      <TopTitleSettingsContainerSection />
      <SettingsWidgetBlock />
    </div>
  )
}

export default SettingsContentSection
