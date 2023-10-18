import type { NextPage } from 'next'
import { useMemo, useState, type CSSProperties } from 'react'

type LogoutButtonType = {
  /** Style props */
  width?: CSSProperties['width']
  navInnerContentContainerWidth?: CSSProperties['width']
  menuNavTextFlex?: CSSProperties['flex']
}

const LogoutButton: NextPage<LogoutButtonType> = ({
  width,
  navInnerContentContainerWidth,
  menuNavTextFlex
}) => {
  const logoutButtonStyle: CSSProperties = useMemo(() => {
    return {
      width: width
    }
  }, [width])

  const navInnerContentContainer4Style: CSSProperties = useMemo(() => {
    return {
      width: navInnerContentContainerWidth
    }
  }, [navInnerContentContainerWidth])

  const menuNavText4Style: CSSProperties = useMemo(() => {
    return {
      flex: menuNavTextFlex
    }
  }, [menuNavTextFlex])

  // State for hover effect
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`rounded-mini flex flex-col items-start justify-start p-4 text-left text-base font-kumbh-sans ${
        isHovered ? 'bg-black-4 text-white-1' : 'text-white-1'
      }`}
      style={logoutButtonStyle}
    >
      <div
        className='w-40 h-6 flex flex-row items-center justify-start gap-[16px]'
        style={navInnerContentContainer4Style}
      >
        <img
          className='relative w-6 h-6'
          alt=''
          src='/logouticoncontainer.svg'
        />
        <div
          className='relative leading-[140%]'
          style={{
            ...menuNavText4Style,
            fontSize: isHovered ? '1.25rem' : '1rem',
            transition: 'font-size 0.3s ease'
          }}
        >
          Logout
        </div>
      </div>
    </div>
  )
}

export default LogoutButton
