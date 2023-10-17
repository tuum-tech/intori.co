import type { NextPage } from 'next'
import MiddleSideNavContainer from './middle-side-nav-container'
import SideNavigationLogoContainer from './side-navigation-logo-container'

type TopSideNavContainerType = {
  intoriLogoMark?: string
  closeMenuIconContainer?: string
  overviewIconContainer?: string
  credentialsIconContainer?: string
  uploadIconContainer?: string
  settingsIconContainer?: string
}

const TopSideNavContainer: NextPage<TopSideNavContainerType> = ({
  intoriLogoMark,
  closeMenuIconContainer,
  overviewIconContainer,
  credentialsIconContainer,
  uploadIconContainer,
  settingsIconContainer
}) => {
  return (
    <div className='flex flex-col items-start justify-start gap-[80px] lg:items-center lg:justify-start'>
      <SideNavigationLogoContainer
        intoriLogoMark='/intorilogomark.svg'
        closeMenuIconContainer='/closemenuiconcontainer.svg'
      />
      <MiddleSideNavContainer
        overviewIconContainer='/overviewiconcontainer.svg'
        credentialsIconContainer='/credentialsiconcontainer2.svg'
        uploadIconContainer='/uploadiconcontainer4.svg'
        settingsIconContainer='/settingsiconcontainer.svg'
      />
    </div>
  )
}

export default TopSideNavContainer
