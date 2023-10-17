import type { NextPage } from 'next'
import SignInDefaultFullContainer from '../components/sign-in/sign-in-default-full-container'

const SigninDefaultScreen: NextPage = () => {
  return (
    <div className='relative bg-black-0 w-full h-screen flex flex-col items-start justify-start sm:pl-0 sm:pr-0 sm:box-border'>
      <SignInDefaultFullContainer />
    </div>
  )
}

export default SigninDefaultScreen
