import { NextPage } from 'next'
import React from 'react'
import styles from './styles.module.css'
import { Note } from '../Note'
import { InputError } from '../InputError'

type Props = {
  label?: string
  placeholder?: string
  value: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onClick?: React.MouseEventHandler<HTMLTextAreaElement>
  readOnly?: boolean
  required?: boolean
  name?: string
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
  error?: string
  note?: string
  spellCheck?: boolean
  rows?: number
}

const Textarea: NextPage<Props> = ({
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
  note,
  spellCheck,
  rows = 4
}) => {
  return (
    <div className={styles.textareaContainer}>
      { !!label && (
        <label htmlFor={name}>
          {label }
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onClick={onClick}
        readOnly={readOnly}
        required={required}
        onBlur={onBlur}
        name={name}
        spellCheck={spellCheck}
        rows={rows}
      />

      <Note note={note} />

      <InputError error={error} />
    </div>
  )
}

export default Textarea
