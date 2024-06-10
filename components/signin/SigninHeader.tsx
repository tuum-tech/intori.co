import Image from 'next/image'
import { NextPage } from 'next'

const SigninHeader: NextPage = () => {
  return (
    <div className='self-stretch flex flex-col items-center justify-start py-0 px-3 gap-[24px] lg:pl-3 lg:pr-3 lg:box-border md:pl-3 md:pr-3 md:box-border sm:pl-3 sm:pr-3 sm:box-border Small_Tablet:pl-3 Small_Tablet:pr-3 Small_Tablet:box-border'>
      <Image
        alt='Intori'
        src='/intorilogomark.svg'
        width={26}
        height={35}
      />
      <div className='self-stretch flex flex-col items-center justify-start gap-[12px]'>
        <div className='self-stretch relative font-semibold'>
          Sign in to Intori with Farcaster
        </div>
        <div className='w-full relative text-sm leading-[22px] font-light text-white-1 inline-block max-w-[300px]'>
          Get paid for what you already do and earn from online activity.
        </div>
      </div>
    </div>
  )
}

export default SigninHeader
