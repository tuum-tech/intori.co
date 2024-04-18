import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";
import Head from 'next/head'
import { Fragment } from 'react'
import './global.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>Intori</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </Fragment>
  )
}

export default MyApp
