// Input.tsx
import { NextPage } from 'next'
import React from 'react'

type Props = {
  label: string
  placeholder?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: NextPage<Props> = ({ label, placeholder, value, onChange }) => {
  return (
    <div className='self-stretch flex flex-col items-start gap-[10px]'>
      <div className='flex-1 relative font-medium'>{label}</div>
      <input
        className='self-stretch rounded-mini box-border h-14 pl-5 text-sm text-grey-1 font-kumbh-sans border-[1px] border-solid border-black-4'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Input
