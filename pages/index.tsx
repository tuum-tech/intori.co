import { useRouter } from 'next/router'
import { useState } from 'react'
import Button from '../components/common/Button'
import EmailInput from '../components/signin/EmailInput'
import SigninHeader from '../components/signin/SigninHeader'
import { useAuth } from '../contexts/AuthContext' // Import the useAuth hook

const SigninDefaultScreen = () => {
  const [email, setEmail] = useState('')
  const { loginWithEmail, loading } = useAuth() // Destructure loginWithEmail and loading from the useAuth hook
  const router = useRouter()

  const handleSignIn = async () => {
    // Here, you might want to add some validation for the email.
    const success = await loginWithEmail(email)
    if (success) {
      router.push('/upload')
    }
  }

  if (loading) {
    return <div>Loading...</div>
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
