import { NextPage } from 'next'
import React from 'react'
import styles from './styles.module.css'

type Props = {
  label?: string
  placeholder?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: React.MouseEventHandler<HTMLInputElement>
  readOnly?: boolean
  required?: boolean
  name?: string
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  error?: string
  note?: string
}

const Input: NextPage<Props> = ({
  label,
  placeholder,
  value,
  onChange,
  onClick,
  readOnly,
  required,
  name,
  onBlur,
  error,
  note
}) => {
  return (
    <div className={styles.inputContainer}>
      { !!label && (
        <label htmlFor={name}>
          {label }
        </label>
      )}

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onClick={onClick}
        readOnly={readOnly}
        required={required}
        onBlur={onBlur}
        name={name}
      />
      {note?.length && (
          <sub className={styles.note}>
            {note}
          </sub>
      )}
      <sub className={styles.error}>
         {error ?? ''}
      </sub>
    </div>
  )
}

export default Input
