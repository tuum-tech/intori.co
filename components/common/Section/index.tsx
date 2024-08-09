import React from 'react'
import styles from './Section.module.css'

type Props = {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export const Section: React.FC<Props> = ({
  title,
  subtitle,
  children
}) => {
    return (
      <div className={styles.section}>
        {title?.length && <h1>{title}</h1>}
        {subtitle?.length && <h2>{subtitle}</h2>}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    )
}

export const SectionTopActions: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.topActions}>
      {children}
    </div>
  )
}
