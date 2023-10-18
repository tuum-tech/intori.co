import type { NextPage } from 'next'
import CreateCredentialsContainer from '../uncategorized/create-credentials-container'
import WidgetTitleHeaderContainer from '../uncategorized/widget-title-header-container'
import UploadDataContainer from '../upload/upload-data-container'

const WidgetTopTitleBarUploadData: NextPage = () => {
  return (
    <div className='self-stretch h-14 flex flex-row items-center justify-start py-0 pr-0 pl-6 box-border gap-[20px] text-left text-xs text-white-1 font-kumbh-sans'>
      <WidgetTitleHeaderContainer />
      <CreateCredentialsContainer />
      <UploadDataContainer />
    </div>
  )
}

export default WidgetTopTitleBarUploadData
