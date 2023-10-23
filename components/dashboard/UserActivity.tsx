import type { NextPage } from 'next'
import ViewAllButton from './ViewAllButton'

const UserActivity: NextPage = () => {
  return (
    <a className='[text-decoration:none] self-stretch rounded-mini flex flex-col items-start justify-start py-0 px-3 gap-[6px] text-left text-sm text-white-0 font-kumbh-sans'>
      <div className='self-stretch h-14 flex flex-row items-center justify-start gap-[20px] text-left text-3xl text-white-0 font-kumbh-sans'>
        <div className='self-stretch flex-1 flex flex-row items-center justify-start Small_Tablet:flex'>
          <h1 className='m-0 relative text-inherit font-semibold font-inherit Small_Tablet:hidden'>
            Activity
          </h1>
        </div>
        <ViewAllButton gotoPage='/dashboard' />
      </div>
      {/* User Activity #2 */}
      <div className='self-stretch rounded-mini flex flex-row items-center justify-between p-3 text-left text-sm text-white-0 font-kumbh-sans'>
        <div className='flex-1 flex flex-row items-start justify-start gap-[12px]'>
          <div className='rounded-3xs bg-brand-primary w-7 h-7 flex flex-row items-center justify-center p-1.5 box-border'>
            <img
              className='relative w-3.5 h-3.5'
              alt=''
              src='/amazoniconblack.svg'
            />
          </div>
          <div className='flex-1 flex flex-row items-center justify-start'>
            <div className='flex-1 flex flex-col items-start justify-start gap-[7px]'>
              <div className='self-stretch relative'>
                Request Your Amazon Order History
              </div>
              <div className='relative text-xs text-white-1 text-right'>
                Just now
              </div>
            </div>
          </div>
        </div>
        <div className='self-stretch flex flex-row items-center justify-start'>
          <img
            className='relative w-[7px] h-[7px]'
            alt=''
            src='/notificationdoticon.svg'
          />
        </div>
      </div>
      {/* User Activity #1 */}
      <div className='self-stretch rounded-mini flex flex-row items-center justify-between p-3 text-left text-sm text-white-0 font-kumbh-sans'>
        <div className='flex-1 flex flex-row items-start justify-start gap-[12px]'>
          <div className='rounded-3xs bg-brand-primary w-7 h-7 flex flex-row items-center justify-center p-1.5 box-border'>
            <img
              className='relative w-4 h-4 overflow-hidden shrink-0'
              alt=''
              src={'/profileiconcontainer2.svg'}
            />
          </div>
          <div className='flex-1 flex flex-row items-center justify-start'>
            <div className='flex-1 flex flex-col items-start justify-start gap-[7px]'>
              <div className='self-stretch relative'>
                Account Creation Successful
              </div>
              <div className='relative text-xs text-white-1 text-right'>
                Just now
              </div>
            </div>
          </div>
        </div>
        <div className='self-stretch flex flex-row items-center justify-start'>
          <img
            className='relative w-[7px] h-[7px]'
            alt=''
            src='/notificationdoticon.svg'
          />
        </div>
      </div>
    </a>
  )
}

export default UserActivity
