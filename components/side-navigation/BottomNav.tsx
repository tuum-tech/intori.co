import type { NextPage } from 'next'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

const BottomNav: NextPage = () => {
  return (
    <div className='flex flex-col items-start justify-start lg:w-auto lg:[align-self:unset] lg:items-center lg:justify-between lg:gap-[0px]'>
      <Link href='/' className='no-underline outline-none visited:text-current'>
        <LogoutButton
          width='192px'
          navInnerContentContainerWidth='unset'
          menuNavTextFlex='unset'
        />
      </Link>
    </div>
  )
}

export default BottomNav
