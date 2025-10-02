"use client";

import React, { useCallback, useState, useEffect } from 'react'
import { getCsrfToken, signIn, signOut } from "next-auth/react"
import {
  SignInButton,
  AuthKitProvider,
  StatusAPIResponse
} from "@farcaster/auth-kit"
import "@farcaster/auth-kit/styles.css"
import { getAuthKitConfig } from '../../utils/farcaster'

import styles from './SignInWithFarcaster.module.css'

type Props = {
  redirect?: string
}

export const SignInWithFarcasterButton: React.FC<Props> = ({ redirect }) => {
  const [error, setError] = useState(false)
  const [authKitConfig, setAuthKitConfig] = useState<any>(null)

  // Build config only on client
  useEffect(() => {
    setAuthKitConfig(getAuthKitConfig())
  }, [])

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
    const buttonElement = document.querySelectorAll('.fc-authkit-signin-button button')
    for (let i = 0; i < buttonElement.length; i++) {
      (buttonElement[i] as HTMLButtonElement).innerText = 'Sign in with Farcaster'
    }
  }, [])

  // Don't render until config is ready
  if (!authKitConfig) return null

  return (
    <div className={styles.farcasterButton}>
      <AuthKitProvider config={authKitConfig}>
        <SignInButton
          nonce={getNonce}
          onSuccess={handleSuccess}
          onError={() => setError(true)}
          onSignOut={() => signOut()}
        />
        {error && <div>Unable to sign in at this time.</div>}
      </AuthKitProvider>
    </div>
  )
}

