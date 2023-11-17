import type { NextPage } from 'next'
import Notification from './Notification'
import ProfileAvatar from './ProfileAvatar'
import SearchBar from './SearchBar'

const TopNavigationMenu: NextPage = () => {
  return (
    <div className='self-stretch flex flex-row items-center justify-start gap-[48px] text-base text-grey-1'>
      <SearchBar />
      <Notification />
      <ProfileAvatar />
    </div>
  )
}

export default TopNavigationMenu
