// SigninButton.tsx
import React from 'react'
import Button from '../common/Button'

type Props = {
  onClick: () => void
}

const SigninButton: React.FC<Props> = ({ onClick }) => (
  <Button label='Sign in' onClick={onClick} />
)

export default SigninButton
