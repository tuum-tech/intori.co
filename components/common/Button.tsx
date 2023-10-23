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
}

const Button: NextPage<Props> = ({
  title,
  titleColor,
  alignSelf,
  width,
  border,
  maxWidth,
  onClick
}) => {
  const activeStyle: CSSProperties = useMemo(() => {
    return {
      alignSelf,
      width,
      border,
      maxWidth
    }
  }, [alignSelf, width, border, maxWidth])

  const titleStyle: CSSProperties = useMemo(() => {
    return {
      color: titleColor
    }
  }, [titleColor])

  return (
    <div
      className='self-stretch rounded-mini bg-primary h-14 flex items-center justify-center text-lg text-black-1 font-kumbh-sans cursor-pointer hover:bg-primary-hover transition duration-300 ease-in-out'
      style={activeStyle}
      onClick={onClick}
    >
      <div className='relative leading-[18px] font-semibold' style={titleStyle}>
        {title}
      </div>
    </div>
  )
}

export default Button
