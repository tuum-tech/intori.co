import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useMemo } from 'react'
import './global.css'

function MyApp({ Component, pageProps }: AppProps) {
  // TODO: NextAuth hook with Farcaster auth integration will determine
  const isLoggedIn = useMemo(() => false, [])
  const loading = useMemo(() => false, [])
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
      { /* TODO: Add NextAuth provider here */ }
      <Component {...pageProps} />
    </Fragment>
  )
}

export default MyApp
