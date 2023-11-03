import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useDid } from '@/contexts/DidContext'
import { loadOrCreateWallet } from '@/lib/thirdweb/localWallet'
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

    const success = await loginWithEmail(email)
    if (success) {
      const wallet = await loadOrCreateWallet()
      const newVeramoState = await loadVeramoState(veramoState, wallet)

      // Dispatch the action to update veramoState
      dispatch({ type: 'SET_VERAMO_STATE', payload: newVeramoState })
      router.push('/upload')
    } else {
      setIsProcessing(false)
    }
  }

  if (loading || isProcessing) {
    return <LoadingSpinner loadingText='Signing you in...' />
  }

  return (
    <div className='relative bg-black-0 w-full h-screen flex flex-col items-start justify-start'>
      <div className='self-stretch flex-1 overflow-hidden flex flex-row items-center justify-center h-screen text-center text-11xl text-white-0 font-kumbh-sans'>
        <div className='self-stretch flex-1 flex flex-col items-center justify-center py-10 px-3 box-border max-w-[400px] h-screen text-center'>
          <SigninHeader />
          <div className='self-stretch flex flex-col items-center justify-start gap-[25px] text-left'>
            <EmailInput value={email} onChange={(value) => setEmail(value)} />
            <Button title='Sign in' onClick={handleSignIn} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SigninDefaultScreen
