import type { NextPage } from 'next'

const NotificationIconActiveContainer: NextPage = () => {
  return (
    <div className='rounded-mini flex flex-col items-center justify-center p-4'>
      <img
        className='relative w-6 h-6 overflow-hidden shrink-0'
        alt=''
        src='/notificationactiveiconcontainer.svg'
      />
    </div>
  )
}

export default NotificationIconActiveContainer
