import React from 'react'
import styles from './Button.module.css'

type Props = {
  children: React.ReactNode
  onClick?: React.MouseEventHandler
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const combineStyles = (styles: string[]) => {
  return styles.join(' ')
}

export const PrimaryButton: React.FC<Props> = ({
  onClick,
  children,
  disabled,
  type
}) => {
  return (
    <button
        className={combineStyles([styles.primaryButton, styles.button])}
        disabled={disabled}
        onClick={onClick}
        type={type ?? 'button'}
    >
      { children }
    </button>
  )
}

export const SecondaryButton: React.FC<Props> = ({
  onClick,
  children,
  disabled,
  type
}) => {
  return (
    <button
        className={combineStyles([styles.secondaryButton, styles.button])}
        disabled={disabled}
        onClick={onClick}
        type={type ?? 'button'}
    >
      { children }
    </button>
  )
}

export const DangerButton: React.FC<Props> = ({
  onClick,
  children,
  disabled,
  type
}) => {
  return (
    <button
        className={combineStyles([styles.dangerButton, styles.button])}
        disabled={disabled}
        onClick={onClick}
        type={type ?? 'button'}
    >
      { children }
    </button>
  )
}
