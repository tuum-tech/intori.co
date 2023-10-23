import type { NextPage } from 'next'
import { useRouter } from 'next/router'

interface BackButtonProps {
  backTo?: string
}

const BackButton: NextPage<BackButtonProps> = ({ backTo = '/' }) => {
  const router = useRouter()

  const handleBackClick = () => {
    router.push(backTo)
  }

  return (
    <div
      className='self-stretch rounded-mini flex flex-col items-start justify-start p-4 text-left text-base text-white-1 font-kumbh-sans cursor-pointer'
      onClick={handleBackClick}
    >
      <div className='h-6 flex flex-row items-center justify-start gap-[8px]'>
        <img
          className='relative w-6 h-6'
          alt=''
          src='/arrowstylebackiconcontainer.svg'
        />
        <div className='relative leading-[140%]'>Back</div>
      </div>
    </div>
  )
}

export default BackButton
