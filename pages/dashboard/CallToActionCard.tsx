import React from 'react'
import Link from 'next/link'
import { SecondaryButton } from '../../components/common/Button'
import styles from './Dashboard.module.css'

type Props = {
  children: React.ReactNode
  title: string
}

export const CallToActionCard: React.FC<Props> = ({
  children,
  title
}) => {
    return (
      <div className={styles.ctaCard}>
        <h4> {title} </h4>
        <h3> {children} </h3>
        <Link href="#">
          <SecondaryButton>
            Explore Suggestions
          </SecondaryButton>
        </Link>
      </div>
    )
}

