import React from 'react'
import styles from './styles.module.css'

type Props = {
  children: React.ReactNode
}

export const Empty: React.FC<Props> = ({ children }) => {
    return (
      <div className={styles.empty}>
        { children }
      </div>
    )
}

