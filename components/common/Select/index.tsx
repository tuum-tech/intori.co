import React from 'react'
import { FormikContextType } from 'formik'
import styles from './styles.module.css'

type Props = {
  formik: FormikContextType<any>
  name: string
  label: string
  note?: string
  error?: string
  placeholder: string
  options: { label: string, value: string }[]
}

export const Select: React.FC<Props> = ({
  formik,
  name,
  label,
  note,
  error,
  options,
  placeholder
}) => {
  const value = formik.values[name]
  return (
    <div className={styles.selectContainer}>
      <label htmlFor={name}>{label}</label>
      <select value={value} onChange={formik.handleChange} onBlur={formik.handleBlur} name={name}>
        { placeholder?.length > 0 && (
            <option value="" disabled selected={!value || value === ""}>{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

