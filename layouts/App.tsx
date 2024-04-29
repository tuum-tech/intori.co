import React from 'react'
import Image from 'next/image'

type Props = {
  title: string
  children: React.ReactNode
}

export const AppLayout: React.FC<Props> = ({ title, children }) => {
    return (
      <div className="bg-black-0 w-full h-screen overflow-y-auto flex flex-col font-kumbh-sans">
        <div className='flex flex-col items-center justify-start py-4 px-3 gap-[8px] lg:pl-3 lg:pr-3 lg:box-border md:pl-3 md:pr-3 md:box-border sm:pl-3 sm:pr-3 sm:box-border Small_Tablet:pl-3 Small_Tablet:pr-3 Small_Tablet:box-border'>
          <Image
            className='relative w-[26px] h-[35px]'
            alt='Intori'
            src='/intorilogomark.svg'
            width={26}
            height={35}
          />
          <h1 className="text-white">{title}</h1>
        </div>
          { children }
      </div>
    )
}

