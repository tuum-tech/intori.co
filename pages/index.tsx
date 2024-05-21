import { useRouter } from 'next/router'
import { Triangle } from 'react-loader-spinner'
import { useSession } from "next-auth/react"
import { useEffect, useMemo } from 'react'
import { AuthLayout } from '../layouts/Auth'
import { SignInWithFarcasterButton } from '../components/signin/SignInWithFarcaster'

const SigninDefaultScreen = () => {
  const router = useRouter()
  const session = useSession()

  const initializing = useMemo(() => {
    return !session.status || session.status === "loading"
  }, [session])

  useEffect(() => {
    if (session.status === "authenticated") {
      window.location.href = "/dashboard"
    }
  }, [session, router])

  if (initializing) {
    return (
      <div className='relative bg-black-0 w-full h-screen flex flex-col items-center justify-center text-center text-11xl text-white font-kumbh-sans sm:pl-0 sm:pr-0 sm:box-border'>
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#E3FD8F"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
          <h4>Preparing the run way...</h4>
      </div>
    )
  }

  return (
    <AuthLayout
      title={<>Your <span>data</span>,<br/>connected</>}
      subtitle="Authentic connections curated for you daily on Farcaster"
    >
      <SignInWithFarcasterButton />
    </AuthLayout>
  )
}

export default SigninDefaultScreen
