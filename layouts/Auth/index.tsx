import React from 'react'
import Img from 'next/image'
import styles from './Auth.module.css'
import { Footer } from '../../components/Footer'

type Props = {
  children: React.ReactNode
  title?: JSX.Element | React.ReactNode
  subtitle?: string
}

export const AuthLayout: React.FC<Props> = ({
  title,
  subtitle,
  children
}) => {
    return (
      <div className={styles.authLayout}>
        <div className={styles.logo}>
          <Img src="/intori-logo-full.svg" alt="Intori" width={68} height={30} />
        </div>
        {!!title && <h1>{title}</h1>}
        {!!subtitle && <h2>{subtitle}</h2>}
        {children}
        <Footer />
      </div>
    )
}

