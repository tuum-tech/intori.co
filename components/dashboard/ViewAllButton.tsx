import type { NextPage } from 'next'
import { useRouter } from 'next/router'

type ViewAllButtonProps = {
  gotoPage: string
}

const ViewAllButton: NextPage<ViewAllButtonProps> = ({ gotoPage }) => {
  const router = useRouter()

  const handleViewAllClick = () => {
    router.push({
      pathname: gotoPage
    })
  }

  return (
    <div onClick={handleViewAllClick} className='cursor-pointer'>
      <div className='rounded-mini flex flex-col items-center justify-center py-4 px-0 text-left text-sm text-white-0 font-kumbh-sans'>
        <div className='h-6 flex flex-row items-center justify-start gap-[8px]'>
          <div className='relative leading-[140%]'>View all</div>
          <img
            className='relative w-6 h-6'
            alt=''
            src='/arrowstylerighticoncontainer1.svg'
          />
        </div>
      </div>
    </div>
  )
}

export default ViewAllButton
