import type { NextPage } from 'next'
import SettingsSelectionHeader from './settings-selection-header'

const TopTitleSettingsContainerSection: NextPage = () => {
  return (
    <div className='self-stretch flex flex-col items-start justify-start'>
      <SettingsSelectionHeader settingsSelectionHeaderAlignSelf='stretch' />
    </div>
  )
}

export default TopTitleSettingsContainerSection
