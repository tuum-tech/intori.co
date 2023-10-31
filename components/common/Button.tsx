import { NextPage } from 'next'
import { CSSProperties, useMemo } from 'react'

type Props = {
  title: string
  titleColor?: CSSProperties['color']
  alignSelf?: CSSProperties['alignSelf']
  width?: CSSProperties['width']
  border?: CSSProperties['border']
  maxWidth?: CSSProperties['maxWidth']
  onClick: () => void
  disabled?: boolean
}

const Button: NextPage<Props> = ({
  title,
  titleColor,
  alignSelf,
  width,
  border,
  maxWidth,
  onClick,
  disabled = false // default to false if not provided
}) => {
  const activeStyle: CSSProperties = useMemo(() => {
    return {
      alignSelf,
      width,
      border,
      maxWidth,
      opacity: disabled ? 0.5 : 1, // reduce opacity if disabled
      pointerEvents: disabled ? 'none' : 'auto' // prevent clicks if disabled
    }
  }, [alignSelf, width, border, maxWidth, disabled])

  const titleStyle: CSSProperties = useMemo(() => {
    return {
      color: titleColor
    }
  }, [titleColor])

  // modify the onClick handler to not do anything if the button is disabled
  const handleClick = () => {
    if (!disabled) {
      onClick()
    }
  }

  return (
    <div
      className={`self-stretch rounded-mini bg-primary h-14 flex items-center justify-center text-lg text-black-1 font-kumbh-sans cursor-pointer hover:bg-primary-hover transition duration-300 ease-in-out ${
        disabled ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : ''
      }`}
      style={activeStyle}
      onClick={handleClick}
    >
      <div className='relative leading-[18px] font-semibold' style={titleStyle}>
        {title}
      </div>
    </div>
  )
}

export default Button
