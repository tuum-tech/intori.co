import { NextPage } from 'next'
import React from 'react'
import styles from './styles.module.css'
import { Note } from '../Note'
import { InputError } from '../InputError'

type Props = {
  label?: string
  placeholder?: string
  value: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
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

      <Note note={note} />

      <InputError error={error} />
    </div>
  )
}

export default Input
