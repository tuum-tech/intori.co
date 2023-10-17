import type { NextPage } from 'next'
import SideNavigationButtonLogout from './side-navigation-button-logout'

type BottomSideNavContainerType = {
  logoutIconContainer?: string
}

const BottomSideNavContainer: NextPage<BottomSideNavContainerType> = ({
  logoutIconContainer
}) => {
  return (
    <div className='flex flex-col items-start justify-start lg:w-auto lg:[align-self:unset] lg:items-center lg:justify-between lg:gap-[0px]'>
      <SideNavigationButtonLogout
        sideNavigationButtonLogouWidth='192px'
        navInnerContentContainerWidth='unset'
        menuNavTextFlex='unset'
      />
    </div>
  )
}

export default BottomSideNavContainer
