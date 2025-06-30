import React, { useCallback, useState, useEffect } from 'react'
import { getCsrfToken, signIn, signOut } from "next-auth/react"
import {
  SignInButton,
  AuthKitProvider,
  StatusAPIResponse
} from "@farcaster/auth-kit"
import "@farcaster/auth-kit/styles.css"
import { authKitConfig } from '../../utils/farcaster'

import styles from './SignInWithFarcaster.module.css'

type Props = {
  redirect?: string
}
export const SignInWithFarcasterButton: React.FC<Props> = ({ redirect }) => {
    const [error, setError] = useState(false)

    // A nonce ensures that each authentication request is unique.
    // It prevents attackers from capturing a valid authentication request and replaying
    // it to gain unauthorized access, because replaying the request with the same nonce
    // would immediately be flagged as invalid by the system.
    const getNonce = useCallback(async () => {
        const nonce = await getCsrfToken()

        if (!nonce) {
          throw new Error("Unable to generate nonce")
        }

        return nonce
    }, [])

    const handleSuccess = useCallback(
        async (res: StatusAPIResponse) => {
            await signIn("credentials", {
                message: res.message,
                signature: res.signature,
                name: res.username,
                pfp: res.pfpUrl,
                redirect: false,
            })

          window.location.href = redirect ?? "/dashboard"
        },
        [redirect]
    )

    useEffect(() => {
      const buttonElement = document.querySelectorAll('.fc-authkit-signin-button button');

      for (let i = 0; i < buttonElement.length; i++) {
        (buttonElement[i] as HTMLButtonElement).innerText = 'Sign in with Farcaster';
      }
    }, [])

    return (
      <div className={styles.farcasterButton}>
        <AuthKitProvider config={authKitConfig}>
          <SignInButton
            nonce={getNonce}
            onSuccess={handleSuccess}
            onError={() => setError(true)}
            onSignOut={() => signOut() }
          />
          {error && <div>Unable to sign in at this time.</div>}
        </AuthKitProvider>
      </div>
    )
}

