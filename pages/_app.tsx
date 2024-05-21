import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SessionProvider } from "next-auth/react"
import Head from 'next/head'
import { Fragment } from 'react'
import './global.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>Intori</title>
      </Head>
      <SessionProvider session={session}>
        <ToastContainer position="top-right" />
        <Component {...pageProps} />
      </SessionProvider>
    </Fragment>
  )
}

export default MyApp
