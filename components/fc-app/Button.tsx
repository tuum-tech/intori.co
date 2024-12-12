import React from 'react'
import styles from './styles.module.css'

type Props = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent) => void
}

export const Button: React.FC<Props> = ({ children, type, onClick }) => {
    return (
      <button type={type ?? 'button'} onClick={onClick} className={styles.button}>
        {children}
      </button>
    )
}

