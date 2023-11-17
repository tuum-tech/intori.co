import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useDid } from '@/contexts/DidContext'
import { Wallet, loadOrCreateWallet } from '@/lib/thirdweb/localWallet'
import { loadVeramoState } from '@/lib/veramo/loadVeramoState'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Button from '../components/common/Button'
import EmailInput from '../components/signin/EmailInput'
import SigninHeader from '../components/signin/SigninHeader'
import { useAuth } from '../contexts/AuthContext' // Import the useAuth hook

const SigninDefaultScreen = () => {
  const [email, setEmail] = useState('')
  const { loginWithEmail, loading } = useAuth() // Destructure loginWithEmail and loading from the useAuth hook
  const {
    state: { veramoState },
    dispatch
  } = useDid() // Destructure state and dispatch from the useDid hook
  const [isProcessing, setIsProcessing] = useState(false)

  const router = useRouter()

  const handleSignIn = async () => {
    setIsProcessing(true)

    const wallet: Wallet = await loadOrCreateWallet()
    const success = await loginWithEmail(email, wallet)
    if (success) {
      const newVeramoState = await loadVeramoState(veramoState, wallet)

      // Dispatch the action to update veramoState
      dispatch({ type: 'SET_VERAMO_STATE', payload: newVeramoState })
      router.push('/upload')
    } else {
      setIsProcessing(false)
    }
  }

  if (loading || isProcessing) {
    return <LoadingSpinner loadingText='Logging you in...' />
  }

  return (
    <div className='relative bg-black-0 w-full h-screen flex flex-col items-start justify-start text-center text-11xl text-white font-kumbh-sans sm:pl-0 sm:pr-0 sm:box-border'>
      <div className='self-stretch flex-1 overflow-hidden flex flex-row items-center justify-center h-screen lg:flex-row md:flex-row sm:items-center sm:justify-center'>
        <div className='self-stretch flex-1 flex flex-col items-center justify-center py-10 px-3 box-border max-w-[400px] h-screen lg:h-screen md:gap-[0px] md:items-center md:justify-center md:pl-0 md:pr-0 md:box-border md:max-w-[450px] md:h-screen sm:w-full sm:flex-col sm:gap-[5px] sm:items-center sm:justify-center sm:pl-0 sm:pt-10 sm:pr-0 sm:box-border sm:max-w-[450px] sm:h-screen Small_Tablet:pl-0 Small_Tablet:pr-0 Small_Tablet:box-border'>
          <SigninHeader />
          <div className='self-stretch flex flex-col items-start justify-start gap-[25px] text-left text-sm'>
            <EmailInput value={email} onChange={(value) => setEmail(value)} />
            <Button title='Sign in' onClick={handleSignIn} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SigninDefaultScreen
