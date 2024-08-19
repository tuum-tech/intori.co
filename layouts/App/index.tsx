import React, { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'
import styles from './AppLayout.module.css'
import { Footer } from '../../components/Footer'
import { Dropdown, DropdownItemType } from '../../components/common/Dropdown'
import { ConnectWalletButton } from '../../components/ConnectWallet'
import { NotVerifiedAddressModal } from '../../components/ConnectWallet/NotVerifiedAddressModal'
import { useEthereumWallet } from '../../contexts/EthereumWallet'
import { SignInWithFarcasterButton } from '../../components/signin/SignInWithFarcaster'

type Props = {
  children: React.ReactNode
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const session = useSession()
  const {
    notVerifiedAddressModalShowing,
    setNotVerifiedAddressModalShowing,
    signer,
    formattedAddress,
    attemptToConnectWallet
  } = useEthereumWallet()
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
      { label: 'Suggestions', href: '/suggestions' },
      { label: 'Responses', href: '/responses' },
      { label: 'Channels', href: '/channels' }
    ]

    items.push(
      { label: signer ? formattedAddress : 'Connect Wallet', onClick: attemptToConnectWallet }
    )

    items.push(
      { label: 'Log out', onClick: logout }
    )

    return items
  }, [signer, attemptToConnectWallet, formattedAddress])

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
      <NotVerifiedAddressModal
        isOpen={notVerifiedAddressModalShowing}
        onClose={() => setNotVerifiedAddressModalShowing(false)}
      />
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Image src="/intorilogomark.svg" alt="Intori" width={26} height={35} />
          <nav>
            <Link href="/dashboard" title="Dashboard" className={isNavLinkActive('/dashboard') ? styles.selected : ''}>
              <span className={styles.icon}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8.53127 18.2364V15.7064C8.53125 15.0628 9.0835 14.5399 9.76772 14.5356H12.2741C12.9615 14.5356 13.5189 15.0598 13.5189 15.7064V18.2443C13.5187 18.7906 13.9824 19.2372 14.5632 19.25H16.2341C17.8997 19.25 19.25 17.9801 19.25 16.4135V9.21621C19.2411 8.59993 18.9334 8.02121 18.4146 7.64475L12.7001 3.31537C11.699 2.56154 10.2759 2.56154 9.27481 3.31537L3.58544 7.65261C3.06459 8.02754 2.75641 8.60722 2.75 9.22407V16.4135C2.75 17.9801 4.10029 19.25 5.76595 19.25H7.43684C8.03204 19.25 8.51456 18.7962 8.51456 18.2364" stroke="#F6F4FE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>
              </span>
              Dashboard
            </Link>
            <Link href="/suggestions" title="Suggestions" className={isNavLinkActive('/suggestions') ? styles.selected : ''}>
              <span className={styles.icon}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M14.1765 1V4.16794C14.1765 5.71434 15.4313 6.96779 16.9834 6.97215H19.9948M13.9721 14.7308H8.06974M11.737 10.6443H8.06876M14.4637 1.01285H7.19171C4.91819 1.00414 3.05457 2.80972 3.00101 5.07378V16.7404C2.95073 19.0415 4.78157 20.9483 7.09115 20.9995C7.12503 20.9995 7.15782 21.0006 7.19171 20.9995H15.924C18.2128 20.9069 20.0163 19.023 19.9999 16.7404V6.75849L14.4637 1.01285Z" stroke="#F6F4FE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>
              </span>
              Suggestions
            </Link>
            <Link href="/responses" title="Your Responses" className={isNavLinkActive('/responses') ? styles.selected : ''}>
              <span className={styles.icon}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M15.6053 2.78105L14.7299 2.5473C12.2549 1.8873 11.0174 1.55822 10.0429 2.1183C9.06761 2.67747 8.73577 3.90855 8.07211 6.36888L7.13527 9.84947C6.47161 12.3107 6.13977 13.5409 6.70352 14.5107C7.26636 15.4796 8.50386 15.8096 10.9789 16.4687L11.8534 16.7025C14.3284 17.3625 15.5659 17.6915 16.5412 17.1315C17.5156 16.5723 17.8474 15.3412 18.5102 12.8809L19.4479 9.4003C20.1116 6.93905 20.4425 5.70888 19.8797 4.73905C19.3169 3.76922 18.0812 3.44013 15.6053 2.78105Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M10.9999 19.2005L10.1273 19.4388C7.65778 20.1107 6.42394 20.4472 5.45044 19.8761C4.47878 19.3059 4.14694 18.0519 3.48603 15.5421L2.55011 11.9927C1.88828 9.48382 1.55736 8.2289 2.11928 7.24074C2.60511 6.38549 3.66661 6.41665 5.04161 6.41665M15.4494 6.81357C15.4494 7.55974 14.8408 8.16474 14.09 8.16474C13.3402 8.16474 12.7315 7.55974 12.7315 6.81357C12.7315 6.0674 13.3402 5.4624 14.09 5.4624C14.8417 5.4624 15.4494 6.0674 15.4494 6.81357Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>
              </span>
              Responses
            </Link>
              <Link href="/channels" title="Channels" className={isNavLinkActive('/channels') ? styles.selected : ''}>
                <span className={styles.icon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V88H40V56Zm0,144H40V104H216v96Z"></path></svg>
                </span>
                Channels
              </Link>
          </nav>
        </div>
        <ConnectWalletButton />
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

