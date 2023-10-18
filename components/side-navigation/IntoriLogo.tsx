import type { NextPage } from 'next'
import LogoMarkIconActionContainer from '../uncategorized/logo-mark-icon-action-container'

const IntoriLogo: NextPage = () => {
  return (
    <div className='rounded-mini h-14 flex flex-row items-center justify-start py-4 pr-4 pl-0 box-border gap-[10px] lg:items-center lg:justify-center md:flex'>
      <LogoMarkIconActionContainer intoriLogoMark='/intorilogomark.svg' />
      <div className='rounded-mini hidden flex-col items-center justify-center p-4'>
        <img
          className='relative w-6 h-6 overflow-hidden shrink-0'
          alt=''
          src='/closemenuiconcontainer.svg'
        />
      </div>
    </div>
  )
}

export default IntoriLogo
