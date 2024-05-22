import React from 'react'
import Link from 'next/link'
import { useSession } from "next-auth/react"
import Image from 'next/image'
import styles from './AppLayout.module.css'
import { Footer } from '../../components/Footer'

type Props = {
  children: React.ReactNode
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const session = useSession()

  // TODO:
  // const logout = async (e: React.MouseEvent) => {
  //   e.preventDefault()

  //   await signOut()
  //   window.location.pathname = '/'
  // }

  return (
    <div className={styles.appLayout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Image src="/intorilogomark.svg" alt="Intori" width={26} height={35} />
          <nav>
            <Link href="/dashboard" title="Dashboard">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8.53127 18.2364V15.7064C8.53125 15.0628 9.0835 14.5399 9.76772 14.5356H12.2741C12.9615 14.5356 13.5189 15.0598 13.5189 15.7064V18.2443C13.5187 18.7906 13.9824 19.2372 14.5632 19.25H16.2341C17.8997 19.25 19.25 17.9801 19.25 16.4135V9.21621C19.2411 8.59993 18.9334 8.02121 18.4146 7.64475L12.7001 3.31537C11.699 2.56154 10.2759 2.56154 9.27481 3.31537L3.58544 7.65261C3.06459 8.02754 2.75641 8.60722 2.75 9.22407V16.4135C2.75 17.9801 4.10029 19.25 5.76595 19.25H7.43684C8.03204 19.25 8.51456 18.7962 8.51456 18.2364" stroke="#F6F4FE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>
            </Link>
          </nav>
        </div>
        <button type="button" className={styles.avatar}>
          <Image
            src={session?.data?.user?.image ?? '/intorilogomark.svg'}
            alt='Intori'
            width={34}
            height={34}
          />
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.1508 6H8.7379H4.76413C4.08413 6 3.74413 6.82167 4.2258 7.30334L7.89499 10.9725C8.4829 11.5604 9.43915 11.5604 10.0271 10.9725L11.4225 9.57709L13.6962 7.30334C14.1708 6.82167 13.8308 6 13.1508 6Z" fill="#C9D3EE"/> </svg>
        </button>
      </header>
      <div className={styles.contentContainer}>
        { children }
      </div>

      <Footer />
    </div>
  )
}

