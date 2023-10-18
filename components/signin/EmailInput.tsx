// EmailInput.tsx
import Input from '../common/Input'

type EmailInputProps = {
  value: string
  onChange: (value: string) => void
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange }) => (
  <Input
    label='Email'
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder='Enter your email'
  />
)

export default EmailInput
