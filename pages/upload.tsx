import type { NextPage } from 'next'
import SideNavigationMenu from '../components/side-navigation/side-navigation-menu'
import UploadFullContentSection from '../components/upload/upload-full-content-section'

const Upload: NextPage = () => {
  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu
        logoutIconContainer={`https://d1xzdqg8s8ggsr.cloudfront.net/651eff624d493ebdb30533e4/c7ef00f8-05b4-4469-9232-22a9daafcf4a_1697120647198730448?Expires=-62135596800&Signature=ZMP0pY7qEnH5~SfqCGYFGN8c0uoe7j522TxBtKlguJGm4PlaSeJMpkHmq5IlIIINkuQLupBuyuqlECVDeWpcbB2zhrAlg~zzfB9xSXHmv4PwxuF2ltISiD6wRziSFd1E~WxCp4Y6gVfBAa2qRAP-iCDPlcFzdsthahE6FmMwbi8Dh7bX85wD5jE0ohI412Lf-tkQt6OSirudWvDNmGGMqYZRVLCis~6O~-X9P9giSBnpOj03dbpN2hkbzok-Q-ozHlW-l-RQdiOr2tJLFHtCA2XFsDllpc~B6mhNC37cP9qjOxbPHI95ow0fR~ciQu4j91d-u3gxn~uu3JVza9lmFg__&Key-Pair-Id=K1P54FZWCHCL6J`}
      />
      <UploadFullContentSection />
    </div>
  )
}

export default Upload
