import React, { useMemo } from 'react'
import styles from './styles.module.css'

type Props = {
  children: React.ReactNode
  className?: string
}

export const Page: React.FC<Props> = ({ children, className }) => {

  const fullClassName = useMemo(() => {
    if (className) {
      return `${styles.page} ${className}`
    }

    return styles.page
  }, [className])

  return (
    <div className={fullClassName}>
      { children }
    </div>
  )
}

