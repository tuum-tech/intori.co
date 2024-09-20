import { NextPage } from 'next'
import React from 'react'

type Props = {
  label: string
  placeholder?: string
  value: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CopyTextInput: NextPage<Props> = ({ label, placeholder, value, onChange }) => {
  return (
    <div className='self-stretch flex flex-col items-start justify-start gap-[10px]'>
      <div className='self-stretch flex flex-row items-start justify-start py-2.5 pr-2.5 pl-0'>
        <div className='flex-1 relative font-medium'>{label}</div>
      </div>
      <input
        className='self-stretch rounded-mini box-border h-14 flex flex-row items-center justify-start pt-[15px] pb-4 pr-[25px] pl-5 bg-black-0 text-grey-1 border-[1px] border-solid border-black-4'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default CopyTextInput
