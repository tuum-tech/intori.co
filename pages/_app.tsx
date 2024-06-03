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
        <meta name="description" content="Authentic connections curated for you daily on Farcaster"/>
        <meta name="keywords" content="intori, farcaster, decentralized, warpcast, find users, meet users, suggestions, social farcaster, onchain, onchain summmer, base, base onchain"/>
        <meta name="author" content="Tuum Tech"/>
        <meta property="og:description" content="Authentic connections curated for you daily on Farcaster" />
        <meta name="twitter:description" property="twitter:description" content="Authentic connections curated for you daily on Farcaster"/>
        <meta property="og:image" content="https://www.intori.co/landing-page/metacard.png" />
        <meta property="twitter:card" content="https://www.intori.co/landing-page/metacard.png"/>
        <meta name="twitter:image:src" property="twitter:image:src" content="https://www.intori.co/landing-page/metacard.png"/>
        <meta name="twitter:image" property="twitter:image" content="https://www.intori.co/landing-page/metacard.png"/>
        <meta name="og:image:alt" property="og:image:alt" content="Intori – Your data, connected" />
        <meta property="og:url" content="https://www.intori.co" />
        <meta property="og:type" content="website"/>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://www.intori.co/landing-page/metacard.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />

        <meta name={`fc:frame:button:1`} content="Learn More" />
        <meta name={`fc:frame:button:1:action`} content="link" />
        <meta name={`fc:frame:button:1:target`} content="https://www.intori.co" />
      </Head>
      <SessionProvider session={session}>
        <ToastContainer position="top-right" />
        <Component {...pageProps} />
      </SessionProvider>
    </Fragment>
  )
}

export default MyApp
