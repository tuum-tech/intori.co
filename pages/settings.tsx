import SettingsSelection from '@/components/settings/SettingsSelection'
import SwitchTheme from '@/components/settings/SwitchTheme'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import type { NextPage } from 'next'
import { useState } from 'react'
import SideNavigationMenu from '../components/side-navigation/SideNavigationMenu'

const Settings: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'General' | 'Profile'>('General')
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu />
      <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-base text-white-0 font-kumbh-sans'>
        <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-base text-white-0 font-kumbh-sans'>
          <TopNavigationMenu />
          <div className='self-stretch flex flex-col items-start justify-start'>
            <SettingsSelection
              activeTab={activeTab}
              onTabChange={setActiveTab}
              alignSelf='stretch'
            />
          </div>
          <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[35px] text-left text-base text-white-0 font-kumbh-sans border-[1px] border-solid border-black-4'>
            <div className='self-stretch relative text-base font-semibold font-kumbh-sans text-white-0 text-left'>
              Application Preferences
            </div>
            <div className='self-stretch flex flex-row items-center justify-between text-left text-base text-white-0 font-kumbh-sans'>
              <div className='flex-1 flex flex-col items-start justify-start gap-[6px] text-left text-base text-white-0 font-kumbh-sans'>
                <div className='self-stretch relative font-semibold'>Theme</div>
                <div className='self-stretch relative text-xs text-white-1'>
                  Choose light or dark mode.
                </div>
              </div>
              <SwitchTheme
                theme={theme}
                onToggle={() =>
                  setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
