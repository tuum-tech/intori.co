import type { NextPage } from 'next'
import BottomNav from './BottomNav'
import IntoriLogo from './IntoriLogo'
import MiddleNav from './MiddleNav'

const SideNavigationMenu: NextPage = () => {
  return (
    <div className='self-stretch bg-black-0 box-border w-[260px] overflow-hidden shrink-0 flex flex-col items-center justify-between pt-6 px-5 pb-8 border-r-[1px] border-solid border-black-3 lg:w-auto lg:self-stretch lg:h-auto lg:items-center lg:justify-between lg:gap-[0px] md:hidden Small_Tablet:hidden'>
      <div className='flex flex-col items-start justify-start gap-[80px] lg:items-center lg:justify-start'>
        <IntoriLogo />
        <MiddleNav />
      </div>
      <BottomNav />
    </div>
  )
}

export default SideNavigationMenu
