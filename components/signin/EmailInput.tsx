// EmailInput.tsx
import { NextPage } from 'next'
import Input from '../common/Input'

type EmailInputProps = {
  value: string
  onChange: (value: string) => void
}

const EmailInput: NextPage<EmailInputProps> = ({ value, onChange }) => {
  return (
    <Input
      label='Email'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Enter your email'
    />
  )
}

export default EmailInput
