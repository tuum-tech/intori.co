import type { GetServerSideProps } from "next";
import Head from 'next/head'
import Image from 'next/image'
import { getSession } from "next-auth/react"
import { AuthLayout } from '../layouts/Auth'
import { SignInWithFarcasterButton } from '../components/signin/SignInWithFarcaster'
import styles from './index.module.css'

export const getServerSideProps = (async (context) => {
  const session = await getSession(context)

  if (session?.user?.fid) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    }
  }

  return {
    props: {}
  }
}) satisfies GetServerSideProps

const SigninDefaultScreen = () => {
  return (
    <>
      <Head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://www.intori.co/landing-page/metacard.png" />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta name={`fc:frame:button:1`} content="Learn More" />
        <meta name={`fc:frame:button:1:action`} content="link" />
        <meta name={`fc:frame:button:1:target`} content="https://www.intori.co" />
        <meta property="og:image" content="https://www.intori.co/landing-page/metacard.png" />
      </Head>
      <AuthLayout
        title={<>Your <span>data</span>,<br/>connected</>}
        subtitle="Authentic connections curated for you daily on Farcaster"
      >
        <SignInWithFarcasterButton />
        <div className={styles.appImageContainer}>
          <Image
            className={styles.desktopImage}
            fill
            objectFit="contain"
            src="/landing-page/dash-desktop.png"
            alt="Intori Desktop"
          />
          <Image
            className={styles.mobileImage}
            objectFit="contain"
            fill
            src="/landing-page/dash-mobile.png"
            alt="Intori Mobile"
          />
        </div>

        <div className={styles.faq}>
          <h2>Get to know Intori: <span>FAQ</span></h2>

          <details>
            <summary>What is Intori?</summary>
            <p>Intori (Inter- Origins) transforms the new user experience on <a href="https://www.farcaster.xyz/">Farcaster</a> by providing personalized follow and channel suggestions, ensuring meaningful connections from the start.</p>
          </details>

          <details>
            <summary>What problem is Intori solving?</summary>
            <p>People on social media platforms, including Farcaster, often feel lost and struggle to make quality connections. This results in a lack of engagement and a diminished user experience.</p>
          </details>

          <details>
            <summary>Why is Intori the solution and not other data marketplaces?</summary>
            <p>Intori is designed to solve this problem by leveraging data from Farcaster&apos;s API and user-provided data to offer personalized follow and channel suggestions. With just a few Frame interactions, users can discover relevant connections and engaging channels tailored to their interests, making their social media experience more fulfilling and connected. Intori is your personalized guide to navigating and thriving on Farcaster.</p>
          </details>

          <details>
            <summary>Is Intori Free?</summary>
            <p>The beauty of Intori is that individual users (data providers) do not have to pay to use the product, they’ll get paid in future monetization! There is no cost to get started, accumulate data, and curate suggestions.</p>
          </details>
        </div>

        <SignInWithFarcasterButton />
      </AuthLayout>
    </>
  )
}

export default SigninDefaultScreen
