import type { NextPage } from 'next'
import NoCredentials from '../shared/no-credentials'
import UserCredentialDesktop from '../shared/user-credential-desktop'
import CredentialsNameRow from './credentials-name-row'
import UserCredentialListContainer from './user-credential-list-container'
import WidgetTopTitleBarCredentials from './widget-top-title-bar-credentials'

const CredWidgetDesktopList: NextPage = () => {
  return (
    <div className='self-stretch rounded-mini bg-black-1 box-border overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] min-w-[658px] text-left text-xs text-white-0 font-kumbh-sans border-[1px] border-solid border-black-4'>
      <WidgetTopTitleBarCredentials />
      <CredentialsNameRow />
      <NoCredentials />
      <UserCredentialListContainer />
      <UserCredentialDesktop />
      <UserCredentialDesktop />
      <UserCredentialDesktop />
    </div>
  )
}

export default CredWidgetDesktopList
