import { NextPage } from 'next'

type LoadingSpinnerProps = {
  loadingText: string
}

const LoadingSpinner: NextPage<LoadingSpinnerProps> = ({ loadingText }) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50'>
      <div className='flex flex-col items-center'>
        <div className='w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin'></div>
        <p className='text-white mt-4'>{loadingText}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
