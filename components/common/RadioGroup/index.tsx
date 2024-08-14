import React from 'react'
import { FormikContextType } from 'formik'
import styles from './styles.module.css'

type Props = {
    options: { value: string | boolean | number, label: string }[]
    label: string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formik: FormikContextType<any>

    name: string
}

export const RadioGroup: React.FC<Props> = ({
    options,
    formik,
    label,
    name
}) => {
    return (
        <div className={styles.radioGroup}>
            <label htmlFor={name}>{label}</label>

            {options.map((option) => (
                <label key={option.label} className={styles.oneRadio}>
                  <input
                      type="radio"
                      value={option.value.toString()}
                      checked={formik.values[name].toString() === option.value.toString()}
                      onChange={() => formik.setFieldValue(name, option.value)}
                  />
                  { option.label }
                </label>
            ))}
        </div>
    )
}
