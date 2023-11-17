import type { NextPage } from 'next'

const SearchBar: NextPage = () => {
  return (
    <div className='flex-1 flex flex-row items-center justify-start gap-[24px]'>
      <div className='rounded-mini hidden flex-col items-center justify-center p-4 md:flex'>
        <img
          className='relative w-6 h-6 overflow-hidden shrink-0'
          alt=''
          src='/closemenuiconcontainer.svg'
        />
      </div>
    <div className='flex-1 rounded-mini bg-black-2 h-14 flex flex-col items-start justify-start py-4 px-3.5 box-border'>
      <div className='self-stretch h-6 flex flex-row items-center justify-start gap-[5px]'>
          <img
            className='relative w-6 h-6'
            alt=''
            src='/searchiconcontainer.svg'
          />
                  <div className='relative leading-[140%] lg:flex Small_Tablet:hidden'>
Search</div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
