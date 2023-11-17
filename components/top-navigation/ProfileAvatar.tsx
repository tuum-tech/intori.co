import type { NextPage } from 'next'

const ProfileAvatar: NextPage = () => {
  return (
    <div className='rounded-full bg-intori-white flex flex-col items-center justify-center p-4'>
      <img
        className='relative w-6 h-6 overflow-hidden shrink-0'
        alt=''
        src='/profileiconcontainer.svg'
      />
    </div>
  )
}

export default ProfileAvatar
