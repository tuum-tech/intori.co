import type { NextPage } from 'next'
import RecentCredentialDesktop from './recent-credential-desktop'
import RecentCredentialsNameRow from './recent-credentials-name-row'
import WidgetTopTitleBarRecentCreds from './widget-top-title-bar-recent-creds'

const RecentCredWidgetDesktop: NextPage = () => {
  return (
    <div className='self-stretch rounded-mini bg-black-1 box-border overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] min-w-[500px] text-left text-xs text-white-0 font-kumbh-sans border-[1px] border-solid border-black-4'>
      <WidgetTopTitleBarRecentCreds />
      <RecentCredentialsNameRow />
      <RecentCredentialDesktop />
      <RecentCredentialDesktop />
      <RecentCredentialDesktop />
    </div>
  )
}

export default RecentCredWidgetDesktop
