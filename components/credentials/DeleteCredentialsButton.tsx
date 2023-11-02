import type { NextPage } from 'next'

type DeleteCredentialsButtonProps = {
  onDelete: () => void
  isEnabled: boolean
}

const DeleteCredentialsButton: NextPage<DeleteCredentialsButtonProps> = ({
  onDelete,
  isEnabled
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent any action if the button is disabled
    if (!isEnabled) {
      event.stopPropagation()
      return
    }
    onDelete()
  }

  // Add appropriate styling for disabled state
  const buttonClasses = `rounded-mini bg-black-3 box-border h-14 flex flex-col items-start justify-center py-2 px-3 text-left text-xs text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4 cursor-pointer ${
    isEnabled ? '' : 'opacity-50 cursor-not-allowed'
  }`

  return (
    <div
      className={buttonClasses}
      onClick={handleClick}
      aria-disabled={!isEnabled}
      style={!isEnabled ? { pointerEvents: 'none' } : {}}

    >
      <div className='self-stretch h-6 flex flex-row items-center justify-start gap-[8px]'>
        <img
          className='relative w-6 h-6'
          alt=''
          src='/credentialsiconcontainer1.svg'
        />
        <div className='relative leading-[140%]'>Delete Credentials</div>
      </div>
    </div>
  )
}

export default DeleteCredentialsButton
