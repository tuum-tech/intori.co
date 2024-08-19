import React from 'react'
import { Note } from '../Note'
import { InputError } from '../InputError'

import styles from './styles.module.css'

type Props = {
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  onBlur?: React.FocusEventHandler<HTMLSelectElement>
  name: string
  label: string
  note?: string
  error?: string
  placeholder: string
  options: { label: string, value: string }[]
  value: string
  disabled?: boolean
}

export const Select: React.FC<Props> = ({
  onChange,
  onBlur,
  value,
  name,
  label,
  note,
  error,
  options,
  placeholder,
  disabled
}) => {
  return (
    <div className={styles.selectContainer}>
      <label htmlFor={name}>{label}</label>
      <select value={value} onChange={onChange} onBlur={onBlur} name={name} disabled={disabled}>
        { placeholder?.length > 0 && (
            <option value="" disabled selected={!value || value === ""}>{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Note note={note} />
      <InputError error={error} />
    </div>
  )
}
