import "@farcaster/auth-kit/styles.css"

import { SignIn } from '../components/signin'

const SigninDefaultScreen = () => {
  return (
    <SignIn redirectAfterLogin='/dashboard' />
  )
}

export default SigninDefaultScreen
