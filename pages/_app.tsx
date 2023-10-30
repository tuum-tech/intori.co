import { AuthProvider } from '@/contexts/AuthContext'
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
        <Component {...pageProps} />
      </AuthProvider>
    </Fragment>
  )
}

export default MyApp
