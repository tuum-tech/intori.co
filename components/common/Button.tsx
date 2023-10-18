// Button.tsx
import React from 'react'

type Props = {
  label: string
  onClick: () => void
}

const Button: React.FC<Props> = ({ label, onClick }) => (
  <div
    className='self-stretch rounded-mini bg-primary h-14 flex items-center justify-center text-lg text-black-1 font-kumbh-sans cursor-pointer hover:bg-primary-hover transition duration-300 ease-in-out'
    onClick={onClick}
  >
    <div className='relative leading-[18px] font-semibold'>{label}</div>
  </div>
)
export default Button
