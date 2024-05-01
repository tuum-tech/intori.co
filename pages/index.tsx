import { useRouter } from 'next/router'
import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react"
import { useCallback, useState, useEffect } from 'react'
import {
  SignInButton,
  AuthKitProvider,
  StatusAPIResponse,
} from "@farcaster/auth-kit"
import "@farcaster/auth-kit/styles.css"

import { authKitConfig } from '../utils/farcaster'

import SigninHeader from '../components/signin/SigninHeader'

const SigninDefaultScreen = () => {
    const router = useRouter()

    const session = useSession()
    const [error, setError] = useState(false)

    useEffect(() => {
        if (session.status === "authenticated") {
          window.location.href = "/dashboard"
        }
    }, [session, router])

    console.log({
        domain: authKitConfig.domain
    })

    // A nonce ensures that each authentication request is unique.
    // It prevents attackers from capturing a valid authentication request and replaying
    // it to gain unauthorized access, because replaying the request with the same nonce
    // would immediately be flagged as invalid by the system.
    const getNonce = useCallback(async () => {
        const nonce = await getCsrfToken()
        if (!nonce) throw new Error("Unable to generate nonce")
        return nonce
    }, [])

    const handleSuccess = useCallback(
        async (res: StatusAPIResponse) => {
            console.log({ res })
            await signIn("credentials", {
                message: res.message,
                signature: res.signature,
                name: res.username,
                pfp: res.pfpUrl,
                redirect: false,
            })

          window.location.href = "/dashboard"
        },
        [signIn, router]
    )

  return (
      <AuthKitProvider config={authKitConfig}>
          <div className='relative bg-black-0 w-full h-screen flex flex-col items-start justify-start text-center text-11xl text-white font-kumbh-sans sm:pl-0 sm:pr-0 sm:box-border'>
              <div className='self-stretch flex-1 overflow-hidden flex flex-row items-center justify-center h-screen lg:flex-row md:flex-row sm:items-center sm:justify-center'>
                  <div className='self-stretch flex-1 flex flex-col items-center justify-center py-10 px-3 box-border max-w-[400px] h-screen lg:h-screen md:gap-[0px] md:items-center md:justify-center md:pl-0 md:pr-0 md:box-border md:max-w-[450px] md:h-screen sm:w-full sm:flex-col sm:gap-[5px] sm:items-center sm:justify-center sm:pl-0 sm:pt-10 sm:pr-0 sm:box-border sm:max-w-[450px] sm:h-screen Small_Tablet:pl-0 Small_Tablet:pr-0 Small_Tablet:box-border'>
                      <SigninHeader />
                      <div className='self-stretch flex flex-col items-center justify-center gap-[25px] text-left text-sm'>
                          <SignInButton
                              nonce={getNonce}
                              onSuccess={handleSuccess}
                              onError={() => setError(true)}
                              onSignOut={() => signOut() }
                          />
                          {error && <div>Unable to sign in at this time.</div>}
                      </div>
                  </div>
              </div>
          </div>
      </AuthKitProvider>
  )
}

export default SigninDefaultScreen
