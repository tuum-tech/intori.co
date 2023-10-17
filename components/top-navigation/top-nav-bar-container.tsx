import type { NextPage } from 'next'
import NotificationIconActiveContainer from './notification-icon-active-container'
import ProfileAvatarActionContainer from './profile-avatar-action-container'
import LeftTopNavContainer from './left-top-nav-container'

const TopNavBarContainer: NextPage = () => {
  return (
    <div className='self-stretch flex flex-row items-center justify-start gap-[48px]'>
      <LeftTopNavContainer />
      <NotificationIconActiveContainer />
      <ProfileAvatarActionContainer />
    </div>
  )
}

export default TopNavBarContainer
