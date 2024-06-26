import React from 'react'
import ReactSwitch from "react-switch";
import styles from './styles.module.css'

type Props = {
  name: string
  label: string
  onChange: (checked: boolean) => void
  checked: boolean
  note?: string
}

export const Switch: React.FC<Props> = ({
  name,
  label,
  onChange,
  checked,
  note
}) => {
  return (
    <label htmlFor={name} className={styles.switch}>
      <span>{label}</span>

      <ReactSwitch
        onChange={onChange}
        checked={checked}
        checkedIcon={false}
        uncheckedIcon={false}
        onColor="#9664FA"
      />
      { !!note && <sub>{note}</sub> }
    </label>
  )
}
