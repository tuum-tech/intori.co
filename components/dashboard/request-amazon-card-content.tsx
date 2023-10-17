import type { NextPage } from 'next'
import PrimaryButtonDefaultActive1 from './primary-button-default-active1'

const RequestAmazonCardContent: NextPage = () => {
  return (
    <div className='flex flex-col items-start justify-start gap-[22px] text-left text-9xl text-white-0 font-kumbh-sans flex-1'>
      <b className='w-full relative leading-[35px] inline-block max-w-[300px]'>
        Request Your Amazon Order History
      </b>
      <div className='w-full relative text-base tracking-[0.02em] leading-[150%] text-white-1 inline-block max-w-[360px]'>
        You have not yet uploaded any data. Request order history from Amazon
        and upload here to get started.
      </div>
      <PrimaryButtonDefaultActive1
        buttonTitle='Upload Data'
        primaryButtonDefaultActivAlignSelf='unset'
        primaryButtonDefaultActivWidth='100%'
        primaryButtonDefaultActivBorder='1px solid #ff5927'
        primaryButtonDefaultActivMaxWidth='350px'
        buttonTitleColor='#0f0a05'
      />
    </div>
  )
}

export default RequestAmazonCardContent
