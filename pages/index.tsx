import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react"
import { AuthLayout } from '../layouts/Auth'
import { SignInWithFarcasterButton } from '../components/signin/SignInWithFarcaster'

export const getServerSideProps = (async (context) => {
  const session = await getSession(context)

  if (session?.user?.fid) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    }
  }

  return {
    props: {}
  }
}) satisfies GetServerSideProps

const SigninDefaultScreen = () => {
  return (
    <AuthLayout
      title={<>Your <span>data</span>,<br/>connected</>}
      subtitle="Authentic connections curated for you daily on Farcaster"
    >
      <SignInWithFarcasterButton />
    </AuthLayout>
  )
}

export default SigninDefaultScreen
