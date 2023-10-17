import type { NextPage } from 'next'
import RequestAmazonCardContent from './request-amazon-card-content'

const RequestAmazonHistoryCard: NextPage = () => {
  return (
    <div className='self-stretch rounded-xl bg-black-1 overflow-hidden flex flex-col items-center justify-start p-10 relative gap-[24px] border-[1px] border-solid border-black-4'>
      <img
        className='absolute my-0 mx-[!important] top-[156px] left-[27px] rounded-276xl w-[276px] h-[228px] hidden opacity-[0.2] z-[0]'
        alt=''
        src='/colorfade.svg'
      />
      <div className='self-stretch flex flex-row items-center justify-center z-[1]'>
        <RequestAmazonCardContent />
      </div>
    </div>
  )
}

export default RequestAmazonHistoryCard
