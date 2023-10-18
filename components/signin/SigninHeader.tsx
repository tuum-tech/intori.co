import { NextPage } from 'next'

const SigninHeader: NextPage = () => {
  return (
    <div className='self-stretch flex flex-col items-center justify-start gap-[12px] text-center'>
      <img
        className='relative w-[26px] h-[35px]'
        alt=''
        src='/intorilogomark3.svg'
      />
      <div className='self-stretch relative font-semibold'>
        Sign in to Intori
      </div>
      <div className='w-full relative text-sm leading-[22px] font-light text-white-1 inline-block max-w-[300px]'>
        Get paid for what you already do and earn from online activity.
      </div>
    </div>
  )
}

export default SigninHeader
