import { useAuth } from '@/contexts/AuthContext'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'
import LogoutButton from './LogoutButton'

const BottomNav: NextPage = () => {
  const { logout } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const router = useRouter()

  const handleSignOut = async () => {
    setIsProcessing(true)
    await logout()
    router.push('/')
    setIsProcessing(false)
  }

  if (isProcessing) {
    return <LoadingSpinner loadingText='Logging you out...' />
  }

  return (
    <div
      className='flex flex-col items-start justify-start lg:w-auto lg:[align-self:unset] lg:items-center lg:justify-between lg:gap-[0px] cursor-pointer'
      onClick={handleSignOut}
    >
      <LogoutButton
        width='192px'
        navInnerContentContainerWidth='unset'
        menuNavTextFlex='unset'
      />
    </div>
  )
}

export default BottomNav
