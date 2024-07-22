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
  onBlur
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
    </div>
  )
}

export default Input
