import type { NextPage } from 'next'
import { useRef } from 'react'

type UploadDataButtonProps = {
  onFileSelect: (file: File) => void
}

const UploadDataButton: NextPage<UploadDataButtonProps> = ({
  onFileSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      onFileSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className='rounded-mini bg-black-3 box-border h-14 flex flex-col items-start justify-center py-2 px-3 text-left text-xs text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4 cursor-pointer'
      onClick={handleClick}
    >
      <div className='self-stretch h-6 flex flex-row items-center justify-start gap-[8px]'>
        <img
          className='relative w-6 h-6'
          alt='Upload Icon'
          src='/uploadiconcontainer1.svg'
        />
        <div className='relative leading-[140%]'>Upload Data</div>
        <input
          ref={fileInputRef}
          type='file'
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

export default UploadDataButton
