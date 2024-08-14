import React from 'react'
import styles from './styles.module.css'

type Props = {
  error?: string
}

export const InputError: React.FC<Props> = ({ error }) => {
    return (
      <sub className={styles.error}>
         {error ?? ''}
      </sub>
    )
}

