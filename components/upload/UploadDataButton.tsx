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
    // Get the selected file from the input
    const files = event.target.files
    if (files && files[0]) {
      // If there is a file selected, call the onFileSelect function with that file
      onFileSelect(files[0])
    }
  }

  const handleClick = () => {
    // Trigger the file input when the button is clicked
    fileInputRef.current?.click()
  }

  return (
    <div className='rounded-mini bg-black-3 box-border h-14 flex flex-col items-start justify-center py-2 px-3 text-left text-xs text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
      <button
        className='self-stretch h-6 flex flex-row items-center justify-start gap-[8px]'
        onClick={handleClick}
      >
        <img
          className='relative w-6 h-6'
          alt='Upload Icon'
          src='/uploadiconcontainer1.svg'
        />
        <span className='relative leading-[140%]'>Upload Data</span>
      </button>
      <input
        ref={fileInputRef}
        type='file'
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}

export default UploadDataButton
