import { NextPage } from 'next'

type BiDataCardProps = {
  title: string
  value: string | number
  percentageChange?: string
}

const BiDataCard: NextPage<BiDataCardProps> = ({
  title,
  value,
  percentageChange
}) => {
  return (
    <div className='flex-1 rounded-mini bg-black-1 box-border h-[200px] flex flex-col items-start justify-start pt-6 pb-12 pr-6 pl-12 gap-[24px] min-w-[300px] text-white-1 border-[1px] border-solid border-black-4'>
      <div className='self-stretch rounded-boundvariablesdata2 flex flex-row items-center justify-start'>
        <div className='flex-1 rounded-boundvariablesdata2 flex flex-row items-center justify-between'>
          <div className='flex-1 relative leading-[20px] inline-block h-5'>
            {title}
          </div>
        </div>
      </div>
      <div className='self-stretch rounded-boundvariablesdata2 flex flex-row items-center justify-between text-36xl text-white'>
        <div className='rounded-boundvariablesdata2 flex flex-col items-start justify-center'>
          <div className='self-stretch relative font-light'>{value}</div>
        </div>
        {percentageChange && (
          <div className='self-stretch rounded-boundvariablesdata2 flex flex-row items-center justify-start text-sm'>
            <div className='rounded-boundvariablesdata2 flex flex-col items-start justify-center'>
              <div className='self-stretch relative leading-[18px]'>
                {percentageChange}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BiDataCard
