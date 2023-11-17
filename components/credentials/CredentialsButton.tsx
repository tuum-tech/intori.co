import type { NextPage } from 'next'
import { CSSProperties, useMemo } from 'react'

type Props = {
  title: string
  onClick: () => void
  disabled?: boolean
}

const CredentialsButton: NextPage<Props> = ({ title, onClick, disabled }) => {
  const activeStyle: CSSProperties = useMemo(() => {
    return {
      opacity: disabled ? 0.5 : 1, // reduce opacity if disabled
      pointerEvents: disabled ? 'none' : 'auto' // prevent clicks if disabled
    }
  }, [disabled])

  const handleClick = () => {
    if (!disabled) {
      onClick()
    }
  }

  return (
    <div
      className={`rounded-mini bg-black-3 box-border h-14 flex flex-col items-start justify-center py-2 px-3 text-left text-xs text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4 ${
        disabled
          ? 'hover:bg-gray-400 cursor-not-allowed'
          : 'hover:bg-primary hover:text-black-1 cursor-pointer'
      }`}
      style={activeStyle}
      onClick={handleClick}
    >
      <div className='self-stretch h-6 flex flex-row items-center justify-start gap-[8px]'>
        <img
          className='relative w-6 h-6'
          alt=''
          src='/credentialsiconcontainer1.svg'
        />
        <div className='relative leading-[140%]'>{title}</div>
      </div>
    </div>
  )
}

export default CredentialsButton
