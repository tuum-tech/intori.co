import Image from 'next/image'
import React from 'react'

type Props = {
  children: React.ReactNode
  title?: string
}

export const PageWrapper: React.FC<Props> = ({
  children
}) => {
    return (
      <main className='relative bg-black-0 w-full h-screen overflow-y-auto text-base text-white font-kumbh-sans pt-4'>
        <div className="text-center">
          <Image
            alt=''
            src='/intorilogomark.svg'
            width={26}
            height={35}
          />
          <h1>Intori</h1>
        </div>
        <div className='w-50 m-auto'>
          { children }
        </div>
      </main>
    )
}

