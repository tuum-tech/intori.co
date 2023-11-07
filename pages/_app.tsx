import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { DidProvider } from '@/contexts/DidContext'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useEffect } from 'react'
import './global.css'

function MyApp({ Component, pageProps }: AppProps) {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn && router.pathname !== '/') {
        router.push('/')
      } else if (isLoggedIn && router.pathname === '/') {
        router.push('/dashboard')
      }
    }
  }, [isLoggedIn, loading, router])

  return (
    <Fragment>
      <Head>
        <title>Intori</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <AuthProvider>
        <DidProvider>
          <Component {...pageProps} />
        </DidProvider>
      </AuthProvider>
    </Fragment>
  )
}

export default MyApp
