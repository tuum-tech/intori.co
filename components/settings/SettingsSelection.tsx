import type { NextPage } from 'next'
import { useMemo, type CSSProperties } from 'react'

type SettingsSelectionType = {
  alignSelf?: CSSProperties['alignSelf']
  activeTab: 'General' | 'Profile'
  onTabChange: (tab: 'General' | 'Profile') => void
}

const SettingsSelection: NextPage<SettingsSelectionType> = ({
  alignSelf,
  activeTab,
  onTabChange
}) => {
  const settingsSelectionHeaderStyle: CSSProperties = useMemo(() => {
    return {
      alignSelf
    }
  }, [alignSelf])

  return (
    <div
      className='h-[54px] flex flex-row items-start justify-start pt-[30px] px-0 pb-0 box-border gap-[26px] text-left text-sm text-white-0 font-kumbh-sans'
      style={settingsSelectionHeaderStyle}
    >
      <div
        className={`cursor-pointer relative w-[52px] h-6 ${
          activeTab === 'General' ? 'text-white-0' : 'text-grey-1'
        }`}
        onClick={() => onTabChange('General')}
      >
        {activeTab === 'General' && (
          <img
            className='absolute top-[22.25px] left-[0.25px] w-[52.5px] h-[1.5px]'
            alt=''
            src='/settingactiveline.svg'
          />
        )}
        <div className='absolute top-[0px] left-[0px]'>General</div>
      </div>
      <div
        className={`cursor-pointer self-stretch relative w-[52px] ${
          activeTab === 'Profile' ? 'text-white-0' : 'text-grey-1'
        }`}
        onClick={() => onTabChange('Profile')}
      >
        {activeTab === 'Profile' && (
          <img
            className='absolute top-[22.25px] left-[0.25px] w-[52.5px] h-[1.5px]'
            alt=''
            src='/settingactiveline.svg'
          />
        )}
        <div className='absolute top-[0px] left-[0px]'>Profile</div>
      </div>
    </div>
  )
}

export default SettingsSelection
