import type { NextPage } from 'next'

const DropdownFilter: NextPage = () => {
  return (
    <div className='rounded-mini bg-black-3 flex flex-col items-start justify-center py-2 px-3 text-left text-xs text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
      <div className='self-stretch h-6 flex flex-row items-center justify-between'>
        <div className='relative leading-[140%]'>Today</div>
        <img
          className='relative w-6 h-6 overflow-hidden shrink-0'
          alt=''
          src='/arrowdown1iconcontainerwhite.svg'
        />
      </div>
    </div>
  )
}

export default DropdownFilter
