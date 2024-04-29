import type { NextPage } from 'next'
import ProfileAvatar from './ProfileAvatar'

const TopNavigationMenu: NextPage = () => {
  return (
    <div className='self-stretch flex flex-row items-center justify-start gap-[48px] text-base text-grey-1'>
      <div className="flex-grow" />
      <ProfileAvatar />
    </div>
  )
}

export default TopNavigationMenu
