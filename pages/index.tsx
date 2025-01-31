import type { GetServerSideProps } from "next";
import Head from 'next/head'
import Image from 'next/image'
import { getSession } from "next-auth/react"
import { Footer } from '../components/Footer'

import styles from './index.module.css'

export const getServerSideProps = (async (context) => {
  const session = await getSession(context)

  if (session?.user?.fid) {
    return {
      redirect: {
        permanent: false,
        destination: "/channels"
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

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <Image src="/intorilogomark.svg" alt="Intori Logo" width={24} height={24} />
            </div>
            <h3>intori</h3>
          </div>
          <h1>Meet the Right People <br/>on Farcaster</h1>
          <h2>Answer questions. Unlock insights. Give gifts. Make connections.</h2>
          <p>
            Intori makes it easy to find like-minded people by turning your answers into meaningful introductions and rewarding connections with gifts.
          </p>

          <a
            href="https://warpcast.com/~/frames/launch?domain=frame.intori.co"
            className={styles.cta}
          >
            <span>Open App</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path></svg>
          </a>
        </section>

        <section className={styles.howItWorks}>
          <div className={styles.howItWorksRow}>

            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#8967eb" viewBox="0 0 256 256"><path d="M216,160v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V160a8,8,0,0,1,8-8H208A8,8,0,0,1,216,160ZM128,88A32,32,0,1,0,96,56,32,32,0,0,0,128,88Z" opacity="0.2"></path><path d="M208,144H136V95.19a40,40,0,1,0-16,0V144H48a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V160A16,16,0,0,0,208,144ZM104,56a24,24,0,1,1,24,24A24,24,0,0,1,104,56ZM208,208H48V160H208v48Zm-40-96h32a8,8,0,0,1,0,16H168a8,8,0,0,1,0-16Z"></path></svg>
              <h4>Answer Questions</h4>
              <p>
                📌 Discover insights about yourself and others by answering engaging questions.
              </p>
            </div>

            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#8967eb" viewBox="0 0 256 256"><path d="M184,213.27A80,80,0,0,1,74.7,184l-40-69.32a20,20,0,0,1,34.64-20L55.08,70A20,20,0,0,1,89.73,50l6.92,12h0a20,20,0,0,1,34.64-20l30,52A20,20,0,0,1,196,74l17.31,30A80,80,0,0,1,184,213.27Z" opacity="0.2"></path><path d="M220.17,100,202.86,70a28,28,0,0,0-38.24-10.25,27.69,27.69,0,0,0-9,8.34L138.2,38a28,28,0,0,0-48.48,0A28,28,0,0,0,48.15,74l1.59,2.76A27.67,27.67,0,0,0,38,80.41a28,28,0,0,0-10.24,38.25l40,69.32a87.47,87.47,0,0,0,53.43,41,88.56,88.56,0,0,0,22.92,3,88,88,0,0,0,76.06-132Zm-6.66,62.64A72,72,0,0,1,81.62,180l-40-69.32a12,12,0,0,1,20.78-12L81.63,132a8,8,0,1,0,13.85-8L62,66A12,12,0,1,1,82.78,54L114,108a8,8,0,1,0,13.85-8L103.57,58h0a12,12,0,1,1,20.78-12l33.42,57.9a48,48,0,0,0-5.54,60.6,8,8,0,0,0,13.24-9A32,32,0,0,1,172.78,112a8,8,0,0,0,2.13-10.4L168.23,90A12,12,0,1,1,189,78l17.31,30A71.56,71.56,0,0,1,213.51,162.62ZM184.25,31.71A8,8,0,0,1,194,26a59.62,59.62,0,0,1,36.53,28l.33.57a8,8,0,1,1-13.85,8l-.33-.57a43.67,43.67,0,0,0-26.8-20.5A8,8,0,0,1,184.25,31.71ZM80.89,237a8,8,0,0,1-11.23,1.33A119.56,119.56,0,0,1,40.06,204a8,8,0,0,1,13.86-8,103.67,103.67,0,0,0,25.64,29.72A8,8,0,0,1,80.89,237Z"></path></svg>
              <h4>Get Suggested Follows</h4>
              <p>
                🔍 Find people who share your interests with insight-driven follow suggestions.
              </p>
            </div>

            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#8967eb" viewBox="0 0 256 256"><path d="M208,128v72a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V128Z" opacity="0.2"></path><path d="M216,72H180.92c.39-.33.79-.65,1.17-1A29.53,29.53,0,0,0,192,49.57,32.62,32.62,0,0,0,158.44,16,29.53,29.53,0,0,0,137,25.91a54.94,54.94,0,0,0-9,14.48,54.94,54.94,0,0,0-9-14.48A29.53,29.53,0,0,0,97.56,16,32.62,32.62,0,0,0,64,49.57,29.53,29.53,0,0,0,73.91,71c.38.33.78.65,1.17,1H40A16,16,0,0,0,24,88v32a16,16,0,0,0,16,16v64a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V136a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM149,36.51a13.69,13.69,0,0,1,10-4.5h.49A16.62,16.62,0,0,1,176,49.08a13.69,13.69,0,0,1-4.5,10c-9.49,8.4-25.24,11.36-35,12.4C137.7,60.89,141,45.5,149,36.51Zm-64.09.36A16.63,16.63,0,0,1,96.59,32h.49a13.69,13.69,0,0,1,10,4.5c8.39,9.48,11.35,25.2,12.39,34.92-9.72-1-25.44-4-34.92-12.39a13.69,13.69,0,0,1-4.5-10A16.6,16.6,0,0,1,84.87,36.87ZM40,88h80v32H40Zm16,48h64v64H56Zm144,64H136V136h64Zm16-80H136V88h80v32Z"></path></svg>
              <h4>Send Gifts</h4>
              <p>
                🎁 Encourage new connections by gifting suggested follows when you unlock points.
              </p>
            </div>

          </div>
          <a
            href="https://warpcast.com/~/frames/launch?domain=frame.intori.co"
            className={styles.cta}
          >
            <span>Start answering questions</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path></svg>
          </a>
        </section>

        <section className={styles.benefits}>
          <div className={styles.benefitsRow}>
            <div>
              <div className={styles.oneBenefit}>
                <h4>Effortless Discovery</h4>
                <p>Get introduced to people who <span>share your interests</span></p>
              </div>

              <div className={styles.oneBenefit}>
                <h4>Engage & Earn</h4>
                <p>Every answered question builds your <span>intori profile</span></p>
              </div>

              <div className={styles.oneBenefit}>
                <h4>Build a Positive Network</h4>
                <p>Gift points to encourage <span>meaningful interactions</span></p>
              </div>

              <a
                href="https://warpcast.com/~/frames/launch?domain=frame.intori.co"
                className={styles.cta}
              >
                <span>Find your people</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path></svg>
              </a>
            </div>
            <div>
              <Image
                src="/landing-page/app-preview1.png"
                alt="intori app preview"
                width={414 * 0.8}
                height={896 * 0.8}
                className={styles.appPreview}
              />
            </div>
          </div>
        </section>
        <section className={styles.faq}>
          <h2>Get to know intori</h2>

          <details>
            <summary>What is Intori?</summary>
            <p>
              <span>Intori is a Frame app that helps Farcaster users connect through shared insights.</span>
              <br />
              <br />
              By answering simple questions, you unlock meaningful follow suggestions and gain points to send gifts, making it easy to grow your network.
            </p>
          </details>

          <details>
            <summary>How does gifting work?</summary>
            <p>
              Every time you <span>answer 5 questions, you earn a batch of 5 gifts.</span>
              <br />
              <br />
              These gifts can be sent to your <span>top 5 suggested follows,</span> creating a positive engagement loop.
              <br />
              <br />
              Recipients get a <span>Warpcast notification</span>, encouraging them to connect.
            </p>
          </details>

          <details>
            <summary>How are suggested follows chosen? </summary>
            <p>
              Suggested follows are based on <span>your responses to questions and shared insights.</span>
              <br />
              <br />
              Intori finds people whose interests align with yours, making new connections <span>genuine and valuable.</span>
            </p>
          </details>

          <details>
            <summary>Why use intori over manual discovery?</summary>
            <p>
              Instead of searching through the noise, <span>intori brings the right people to you.</span>
              <br />
              <br />
              It automates networking by surfacing <span>genuine connections</span>, rewarding engagement, and <span>removing friction</span> from finding like-minded people.
            </p>
          </details>

          <details>
            <summary>Can I see my gifted points history?</summary>
            <p>
              Yes! You can see your accumulated points to track how many gifts are available to send. However, we do not yet track the total quantity of gifts sent or received.
              <br />
              <br />
              You can view all gifts you&apos;ve received in chronological order on your home feed, complete with timestamps. Clicking on a gift reveals the sender&apos;s profile, including some of their insights, making it easy to learn more about them and start a conversation.
              <br />
              <br />
              Future updates may include additional tracking features for sent gifts.
            </p>
          </details>
        </section>
        <section className={styles.finalCta}>
          <h3>✅ Start answering questions and discover your next connection.  </h3>
          <h3>✅ Get suggested follows and send gifts with zero effort.</h3>
          <h3>✅ It’s completely free—just open the app and start!</h3>

          <a
            href="https://warpcast.com/~/frames/launch?domain=frame.intori.co"
            className={styles.cta}
          >
            <span>Try intori now</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#ffffff" viewBox="0 0 256 256"><path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"></path></svg>
          </a>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default SigninDefaultScreen
