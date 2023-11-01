import { AuthProvider } from '@/contexts/AuthContext'
import { DidProvider } from '@/contexts/DidContext'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Fragment } from 'react'
import './global.css'

function MyApp({ Component, pageProps }: AppProps) {
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
