import React, { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'
import styles from './AppLayout.module.css'
import { Footer } from '../../components/Footer'
import { Dropdown, DropdownItemType } from '../../components/common/Dropdown'
import { SignInWithFarcasterButton } from '../../components/signin/SignInWithFarcaster'

type Props = {
  children: React.ReactNode
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const session = useSession()
  const { pathname } = useRouter()

  const logout = async (e: React.MouseEvent) => {
    e.preventDefault()

    await signOut()
    window.location.pathname = '/'
  }

  const isNavLinkActive = (href: string) => {
    if (!pathname) {
      return false
    }

    return pathname === href
  }

  const dropdownItems = useMemo(() => {
    const items: DropdownItemType[] = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Questions', href: '/questions' },
      { label: 'Users', href: '/users' },
    ]

    items.push(
      { label: 'Log out', onClick: logout }
    )

    return items
  }, [])

  const redirectUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '/dashboard'
    }

    return window.location.pathname
  
  }, [])

  if (session?.status !== 'authenticated') {
    return (
      <div className={styles.appLayout}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Image src="/intorilogomark.svg" alt="Intori" width={26} height={35} />
          </div>
          <SignInWithFarcasterButton redirect={redirectUrl} />
        </header>
        <div className={styles.contentContainer}>
          { children }
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.appLayout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Image src="/intorilogomark.svg" alt="Intori" width={26} height={35} />
          <nav>
            <Link href="/dashboard" title="Dashboard" className={isNavLinkActive('/dashboard') ? styles.selected : ''}>
              <span className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"></path></svg>
              </span>
              Stats
            </Link>
            <Link href="/dashboard/questions" title="Questions" className={isNavLinkActive('/dashboard/questions') ? styles.selected : ''}>
              <span className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V88H40V56Zm0,144H40V104H216v96Z"></path></svg>
              </span>
              Questions
            </Link>
            <Link href="/dashboard/daily-checkin-questions" title="Daily Check In Questions" className={isNavLinkActive('/dashboard/daily-checkin-questions') ? styles.selected : ''}>
              <span className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path></svg>
              </span>
              Daily Check Ins
            </Link>
            <Link href="/dashboard/users" title="Users" className={isNavLinkActive('/dashboard/users') ? styles.selected : ''}>
              <span className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path></svg>
              </span>
              Users
            </Link>
          </nav>
        </div>
        <Dropdown items={dropdownItems}>
          <span className={styles.avatar}>
            <Image
              src={session?.data?.user?.image ?? '/intorilogomark.svg'}
              alt='Intori'
              width={34}
              height={34}
            />
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M13.1508 6H8.7379H4.76413C4.08413 6 3.74413 6.82167 4.2258 7.30334L7.89499 10.9725C8.4829 11.5604 9.43915 11.5604 10.0271 10.9725L11.4225 9.57709L13.6962 7.30334C14.1708 6.82167 13.8308 6 13.1508 6Z" fill="#C9D3EE"/> </svg>
          </span>
        </Dropdown>
      </header>
      <div className={styles.contentContainer}>
        { children }
      </div>

      <Footer />
    </div>
  )
}

