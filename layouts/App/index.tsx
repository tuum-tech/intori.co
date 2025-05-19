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

    return pathname === href || pathname.startsWith(href)
  }

  const dropdownItems = useMemo(() => {
    const items: DropdownItemType[] = [
      { label: 'Dashboard', href: '/dashboard' },
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
            <Link href="/channels" title="Channels" className={isNavLinkActive('/channels') ? styles.selected : ''}>
              <span className={styles.icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V88H40V56Zm0,144H40V104H216v96Z"></path></svg>
              </span>
              Channels
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

