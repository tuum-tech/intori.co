import SideNavigationMenu from '@/components/side-navigation/side-navigation-menu'
import TopNavBarContainer from '@/components/top-navigation/top-nav-bar-container'
import DataCard from '@/components/upload/DataCard'
import DataTable from '@/components/upload/DataTable'
import type { NextPage } from 'next'

const Upload: NextPage = () => {
  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu
        logoutIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/c7ef00f8-05b4-4469-9232-22a9daafcf4a_1697120647198730448?Expires=-62135596800&Signature=ZMP0pY7qEnH5~SfqCGYFGN8c0uoe7j522TxBtKlguJGm4PlaSeJMpkHmq5IlIIINkuQLupBuyuqlECVDeWpcbB2zhrAlg~zzfB9xSXHmv4PwxuF2ltISiD6wRziSFd1E~WxCp4Y6gVfBAa2qRAP-iCDPlcFzdsthahE6FmMwbi8Dh7bX85wD5jE0ohI412Lf-tkQt6OSirudWvDNmGGMqYZRVLCis~6O~-X9P9giSBnpOj03dbpN2hkbzok-Q-ozHlW-l-RQdiOr2tJLFHtCA2XFsDllpc~B6mhNC37cP9qjOxbPHI95ow0fR~ciQu4j91d-u3gxn~uu3JVza9lmFg__&Key-Pair-Id=K1P54FZWCHCL6J`}
      />
      <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-lg text-white-1 font-kumbh-sans'>
        <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-lg text-white-1 font-kumbh-sans'>
          <TopNavBarContainer />
          <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
            <DataCard title='Data Value' value='$0.00' />
            <DataCard title='Items Selected' value='0/0' />
          </div>
          <DataTable />
        </div>
      </div>
    </div>
  )
}

export default Upload
