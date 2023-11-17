import type { NextPage } from 'next'
import router from 'next/router'
import Button from '../common/Button'

const RequestAmazonHistory: NextPage = () => {
  const handleUploadData = () => {
    router.push('/upload')
  }

  return (
    <div className='self-stretch rounded-xl bg-black-1 overflow-hidden flex flex-col items-center justify-start p-10 relative gap-[24px] text-9xl border-[1px] border-solid border-black-4'>
      <img
        className='absolute my-0 mx-[!important] top-[156px] left-[27px] rounded-276xl w-[276px] h-[228px] hidden opacity-[0.2] z-[0]'
        alt=''
        src='/closemenuiconcontainer.svg'
      />
      <div className='self-stretch flex flex-row items-center justify-center z-[1]'>
        <div className='flex-1 flex flex-col items-start justify-start gap-[22px]'>
          <b className='w-full relative leading-[35px] inline-block max-w-[300px]'>
            Request Your Amazon Order History
          </b>
          <div className='w-full relative text-base tracking-[0.02em] leading-[150%] text-white-1 inline-block max-w-[360px]'>
            You have not yet uploaded any data. Request order history from
            Amazon and upload here to get started.
          </div>
          <Button
            title='Upload Data'
            maxWidth='350px'
            onClick={handleUploadData}
          />
        </div>
      </div>
    </div>
  )
}

export default RequestAmazonHistory
