import type { NextPage } from 'next'
import EmptyActionContainer from '../shared/empty-action-container'

const WidgetTopTitleBarCredentials: NextPage = () => {
  return (
    <div className='self-stretch h-14 flex flex-row items-center justify-start py-0 px-6 box-border gap-[20px] text-left text-3xl text-white-0 font-kumbh-sans'>
      <div className='self-stretch flex-1 flex flex-row items-center justify-start Small_Tablet:flex'>
        <h1 className='m-0 relative text-inherit font-semibold font-inherit Small_Tablet:flex'>
          Your credentials
        </h1>
      </div>
      <EmptyActionContainer />
    </div>
  )
}

export default WidgetTopTitleBarCredentials
