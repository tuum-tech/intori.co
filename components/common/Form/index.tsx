import React from 'react'
import styles from './styles.module.css'

export const FormActions: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
    return (
      <div className={styles.formActions}>
        { children }
      </div>
    )
}

