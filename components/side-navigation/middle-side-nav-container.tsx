import type { NextPage } from 'next'
import { useMemo, type CSSProperties } from 'react'
import SideNavigationButtonCredential from './side-navigation-button-credential'
import SideNavigationButtonOverview from './side-navigation-button-overview'
import SideNavigationButtonSettings from './side-navigation-button-settings'
import SideNavigationButtonUpload from './side-navigation-button-upload'

type MiddleSideNavContainerType = {
  overviewIconContainer?: string
  credentialsIconContainer?: string
  uploadIconContainer?: string
  settingsIconContainer?: string

  /** Style props */
  sideNavigationButtonCredeBackgroundColor?: CSSProperties['backgroundColor']
  sideNavigationButtonCredeBorder?: CSSProperties['border']
  menuNavTextColor?: CSSProperties['color']
  sideNavigationButtonUploaBackgroundColor?: CSSProperties['backgroundColor']
  sideNavigationButtonUploaBorder?: CSSProperties['border']
  menuNavTextColor1?: CSSProperties['color']
  sideNavigationButtonOvervBackgroundColor?: CSSProperties['backgroundColor']
  sideNavigationButtonOvervBorder?: CSSProperties['border']
  menuNavTextColor2?: CSSProperties['color']
  sideNavigationButtonSettiBackgroundColor?: CSSProperties['backgroundColor']
  sideNavigationButtonSettiBorder?: CSSProperties['border']
  menuNavTextColor3?: CSSProperties['color']
}

const MiddleSideNavContainer: NextPage<MiddleSideNavContainerType> = ({
  overviewIconContainer,
  credentialsIconContainer,
  uploadIconContainer,
  settingsIconContainer,
  sideNavigationButtonCredeBackgroundColor,
  sideNavigationButtonCredeBorder,
  menuNavTextColor,
  sideNavigationButtonUploaBackgroundColor,
  sideNavigationButtonUploaBorder,
  menuNavTextColor1,
  sideNavigationButtonOvervBackgroundColor,
  sideNavigationButtonOvervBorder,
  menuNavTextColor2,
  sideNavigationButtonSettiBackgroundColor,
  sideNavigationButtonSettiBorder,
  menuNavTextColor3
}) => {
  const sideNavigationButtonCredentialStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: sideNavigationButtonCredeBackgroundColor,
      border: sideNavigationButtonCredeBorder
    }
  }, [
    sideNavigationButtonCredeBackgroundColor,
    sideNavigationButtonCredeBorder
  ])

  const menuNavText1Style: CSSProperties = useMemo(() => {
    return {
      color: menuNavTextColor
    }
  }, [menuNavTextColor])

  const sideNavigationButtonUploadStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: sideNavigationButtonUploaBackgroundColor,
      border: sideNavigationButtonUploaBorder
    }
  }, [
    sideNavigationButtonUploaBackgroundColor,
    sideNavigationButtonUploaBorder
  ])

  const menuNavText2Style: CSSProperties = useMemo(() => {
    return {
      color: menuNavTextColor1
    }
  }, [menuNavTextColor1])

  const sideNavigationButtonOverviewStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: sideNavigationButtonOvervBackgroundColor,
      border: sideNavigationButtonOvervBorder
    }
  }, [
    sideNavigationButtonOvervBackgroundColor,
    sideNavigationButtonOvervBorder
  ])

  const menuNavTextStyle: CSSProperties = useMemo(() => {
    return {
      color: menuNavTextColor2
    }
  }, [menuNavTextColor2])

  const sideNavigationButtonSettingsStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: sideNavigationButtonSettiBackgroundColor,
      border: sideNavigationButtonSettiBorder
    }
  }, [
    sideNavigationButtonSettiBackgroundColor,
    sideNavigationButtonSettiBorder
  ])

  const menuNavText3Style: CSSProperties = useMemo(() => {
    return {
      color: menuNavTextColor3
    }
  }, [menuNavTextColor3])

  return (
    <div className='h-[296px] flex flex-col items-start justify-between lg:items-start lg:justify-between lg:gap-[0px]'>
      <SideNavigationButtonOverview
        overviewIconContainer='/overviewiconcontainer.svg'
        sideNavigationButtonOvervBackgroundColor='unset'
        sideNavigationButtonOvervBorder='unset'
        sideNavigationButtonOvervWidth='192px'
        navInnerContentContainerWidth='unset'
        menuNavTextColor='#bdb5ab'
      />
      <SideNavigationButtonCredential
        credentialsIconContainer='/credentialsiconcontainer2.svg'
        sideNavigationButtonCredeWidth='192px'
        sideNavigationButtonCredeBackgroundColor='#110f0d'
        sideNavigationButtonCredeBorder='1px solid #2c261e'
        navInnerContentContainerWidth='unset'
        menuNavTextColor='#fff'
      />
      <SideNavigationButtonUpload
        uploadIconContainer='/uploadiconcontainer4.svg'
        sideNavigationButtonUploaWidth='192px'
        sideNavigationButtonUploaBackgroundColor='unset'
        sideNavigationButtonUploaBorder='unset'
        navInnerContentContainerWidth='unset'
        menuNavTextColor='#bdb5ab'
      />
      <SideNavigationButtonSettings
        settingsIconContainer='/settingsiconcontainer.svg'
        sideNavigationButtonSettiWidth='192px'
        sideNavigationButtonSettiBackgroundColor='unset'
        sideNavigationButtonSettiBorder='unset'
        navInnerContentContainerWidth='unset'
        menuNavTextColor='#bdb5ab'
      />
    </div>
  )
}

export default MiddleSideNavContainer
