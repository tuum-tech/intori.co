import { Fragment } from 'react'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Head from 'next/head'
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
import { ToastContainer } from 'react-toastify'
import { WalletProvider } from '../contexts/EthereumWallet'
import { FramesV2EmbedMetaTags } from '../utils/frames/framesV2EmbedMetaTags'

import './global.css'
import 'react-toastify/dist/ReactToastify.css'

Chart.register(CategoryScale)

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Fragment>
      <Head>
        <title>Intori</title>
        <meta name="description" content="Authentic connections curated for you daily on Farcaster"/>
        <meta name="keywords" content="intori, farcaster, decentralized, warpcast, find users, meet users, suggestions, social farcaster, onchain, onchain summmer, base, base onchain"/>
        <meta name="author" content="Tuum Tech"/>
        <meta property="og:description" content="Authentic connections curated for you daily on Farcaster" />
        <meta name="twitter:description" property="twitter:description" content="Authentic connections curated for you daily on Farcaster"/>
        <meta property="twitter:card" content="https://www.intori.co/landing-page/metacard.png"/>
        <meta name="twitter:image:src" property="twitter:image:src" content="https://www.intori.co/landing-page/metacard.png"/>
        <meta name="twitter:image" property="twitter:image" content="https://www.intori.co/landing-page/metacard.png"/>
        <meta property="og:image" content="https://www.intori.co/landing-page/metacard.png" />
        <meta name="og:image:alt" property="og:image:alt" content="Intori – Your data, connected" />
        <meta property="og:url" content="https://www.intori.co" />
        <meta property="og:type" content="website"/>
        <FramesV2EmbedMetaTags />
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
