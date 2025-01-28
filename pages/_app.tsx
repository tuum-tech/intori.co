import type { AppProps } from 'next/app'
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SessionProvider } from "next-auth/react"
import { WalletProvider } from '../contexts/EthereumWallet'
import Head from 'next/head'
import { Fragment } from 'react'
import './global.css'

Chart.register(CategoryScale)

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>Intori – Meet the Right People on Farcaster</title>
        <meta name="description" content="Answer questions. Unlock insights. Give gifts. Make connections."/>
        <meta name="keywords" content="intori, farcaster, decentralized, warpcast, find users, meet users, suggestions, social farcaster, onchain, onchain summmer, base, base onchain"/>
        <meta name="author" content="Tuum Tech"/>
        <meta property="og:description" content="Answer questions. Unlock insights. Give gifts. Make connections." />
        <meta name="twitter:description" property="twitter:description" content="Answer questions. Unlock insights. Give gifts. Make connections."/>
        <meta property="twitter:card" content="https://www.intori.co/landing-page/metacard.png"/>
        <meta name="twitter:image:src" property="twitter:image:src" content="https://www.intori.co/landing-page/metacard.png"/>
        <meta name="twitter:image" property="twitter:image" content="https://www.intori.co/landing-page/metacard.png"/>
        <meta name="og:image:alt" property="og:image:alt" content="Intori – Meet the right people on Farcaster" />
        <meta property="og:url" content="https://www.intori.co" />
        <meta property="og:type" content="website"/>
      </Head>
      <SessionProvider session={session}>
        <WalletProvider>
          <ToastContainer position="top-right" />
          <Component {...pageProps} />
        </WalletProvider>
      </SessionProvider>
    </Fragment>
  )
}

export default MyApp
