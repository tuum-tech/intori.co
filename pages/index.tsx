import type { GetServerSideProps } from "next";
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
          <p>Intori (Inter- Origins) empowers consumers to benefit from first-party data by transforming purchase histories into verifiable data to be shared with businesses anonymously.</p>
        </details>

        <details>
          <summary>What problem is Intori solving?</summary>
          <p>In today's screen-driven world, we spend most of our waking hours online but receive little monetary benefit, even though the data we produce has become highly valuable for businesses. With Intori, consumers can easily connect, convert data, and create verifiable credentials, to be purchased by businesses on a marketplace to drive informed data-driven decisions.</p>
        </details>

        <details>
          <summary>Why is Intori the solution and not other data marketplaces?</summary>
          <p>One reason is that the technology wasn't available. Decentralized Identifiers (DIDs) and AI are relatively new technologies, and they haven't been widely adopted yet. Additionally, in the past, most people were happy to share their data with businesses in exchange for services. However, as people have become more aware of the implications of sharing data, there’s a growing demand for less intrusive solutions. Technology we’ve been developing for 5+ years is the backbone of intori and allows users to share data in a way that is more secure, private, and impossible to achieve previously. We believe the growing demand for data-driven decision making will incentivize businesses to stay competitive and encourage finding ways to collect and use data without violating user privacy.</p>
        </details>

        <details>
          <summary>Is Intori Free?</summary>
          <p>The beauty of Intori is that individual users (data providers) do not have to pay to use the product, they get paid! There is no cost to join, upload data, and create a portfolio. Rather, participants of the marketplace get to take part in 100% revenue sharing.</p>
        </details>
      </div>

      <SignInWithFarcasterButton />
    </AuthLayout>
  )
}

export default SigninDefaultScreen
