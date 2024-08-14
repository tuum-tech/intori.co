// This is the note line under inputs
import React from 'react'
import styles from './styles.module.css'

type Props = {
  note?: string
}

export const Note: React.FC<Props> = ({ note }) => {
    if (!note) {
      return null
    }

    return (
      <sub className={styles.note}>{note}</sub>
    )
}

