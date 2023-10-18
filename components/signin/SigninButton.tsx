// SigninButton.tsx
import { NextPage } from 'next'
import Button from '../common/Button'

type Props = {
  onClick: () => void
}

const SigninButton: NextPage<Props> = ({ onClick }) => {
  return <Button label='Sign in' onClick={onClick} />
}

export default SigninButton
