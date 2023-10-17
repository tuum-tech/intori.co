import type { NextPage } from 'next'
import TopNavBarContainer from '../top-navigation/top-nav-bar-container'
import AmazonIconLargeContainer from '../shared/amazon-icon-large-container'
import CredentailDescriptionWidgetBlo from './credentail-description-widget-blo'
import CredentailExpireDateWidgetBloc from './credentail-expire-date-widget-bloc'
import CredentailIssuedByWidgetBlock from './credentail-issued-by-widget-block'
import CredentailIssuedOnWidgetBlock from './credentail-issued-on-widget-block'
import HeaderContainerGroup from '../shared/header-container-group'

const CredentailDetailsContentSection: NextPage = () => {
  return (
    <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-base text-white-1 font-kumbh-sans'>
      <TopNavBarContainer />
      <HeaderContainerGroup />
      <AmazonIconLargeContainer />
      <CredentailDescriptionWidgetBlo />
      <CredentailIssuedByWidgetBlock />
      <CredentailIssuedOnWidgetBlock />
      <CredentailExpireDateWidgetBloc />
    </div>
  )
}

export default CredentailDetailsContentSection
