import React from 'react'
import styles from './Button.module.css'

type Props = {
  children: React.ReactNode
  onClick: React.MouseEventHandler
  disabled?: boolean
}

export const PrimaryButton: React.FC<Props> = ({
  onClick,
  children,
  disabled,
}) => {
  return (
    <button
        className={styles.primaryButton}
        disabled={disabled}
        onClick={onClick}
    >
      { children }
    </button>
  )
}
