import type { NextPage } from 'next'
import TotalCredentialsWidget from '../shared/total-credentials-widget'
import TotalCredentialValueWidget from './total-credential-value-widget'

const CredentialsWidgetMainContainer: NextPage = () => {
  return (
    <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
      <TotalCredentialValueWidget />
      <TotalCredentialsWidget />
    </div>
  )
}

export default CredentialsWidgetMainContainer
