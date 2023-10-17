import type { NextPage } from 'next'
import CredentailDetailsContentSection from './credentail-details-content-section'

const CredDetailsFullContentSection: NextPage = () => {
  return (
    <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-base text-white-1 font-kumbh-sans'>
      <CredentailDetailsContentSection />
    </div>
  )
}

export default CredDetailsFullContentSection
