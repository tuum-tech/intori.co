// MenuButton.tsx
import { COLORS } from '@/lib/colors'
import type { NextPage } from 'next'
import { useMemo, useState, type CSSProperties } from 'react'

type MenuButtonProps = {
  iconSrc?: string
  labelText: string

  /** Style props */
  buttonWidth?: CSSProperties['width']
  buttonBackgroundColor?: CSSProperties['backgroundColor']
  buttonBorder?: CSSProperties['border']
  navInnerContentContainerWidth?: CSSProperties['width']
  menuNavTextColor?: CSSProperties['color']
}

const MenuButton: NextPage<MenuButtonProps> = ({
  iconSrc,
  labelText,
  buttonWidth,
  buttonBackgroundColor,
  buttonBorder,
  navInnerContentContainerWidth,
  menuNavTextColor
}) => {
  // State for hover effect
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const buttonStyle: CSSProperties = useMemo(() => {
    return {
      width: buttonWidth,
      backgroundColor: isHovered ? COLORS['black-4'] : buttonBackgroundColor, // Update hover logic
      border: buttonBorder
    }
  }, [buttonWidth, buttonBackgroundColor, buttonBorder, isHovered])

  const navInnerContentContainerStyle: CSSProperties = useMemo(() => {
    return {
      width: navInnerContentContainerWidth
    }
  }, [navInnerContentContainerWidth])

  const menuNavTextStyle: CSSProperties = useMemo(() => {
    return {
      color: menuNavTextColor
    }
  }, [menuNavTextColor])

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`rounded-mini flex flex-col items-start justify-start p-4 text-left text-base font-kumbh-sans ${
        isHovered
          ? `${buttonBackgroundColor} ${menuNavTextColor}`
          : menuNavTextColor
      }`}
      style={buttonStyle}
    >
      <div
        className='w-40 h-6 flex flex-row items-center justify-start gap-[16px]'
        style={navInnerContentContainerStyle}
      >
        <img className='relative w-6 h-6' alt='' src={iconSrc} />
        <div
          className='relative leading-[140%]'
          style={{
            ...menuNavTextStyle,
            fontSize: isHovered ? '1.25rem' : '1rem',
            transition: 'font-size 0.3s ease'
          }}
        >
          {labelText}
        </div>
      </div>
    </div>
  )
}

export default MenuButton
