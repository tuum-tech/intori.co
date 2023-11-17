import type { NextPage } from 'next'

type SingleDataCardProps = {
  title: string
  titleContainers?: JSX.Element[]
  value: string | number
  percentageChange?: string
}

const UniDataCard: NextPage<SingleDataCardProps> = ({
  title,
  titleContainers,
  value,
  percentageChange
}) => {
  return (
    <div className='self-stretch rounded-mini bg-black-1 box-border flex flex-col items-start justify-start py-12 pr-[47px] pl-12 gap-[24px] min-w-[300px] border-[1px] border-solid border-black-4'>
      <div className='self-stretch rounded-boundvariablesdata2 flex flex-row flex-wrap items-center justify-start'>
        <div className='flex-1 rounded-boundvariablesdata2 flex flex-col items-start justify-center'>
          <div className='self-stretch relative leading-[20px] inline-block h-5 shrink-0'>
            {title}
          </div>
          {titleContainers}
        </div>
      </div>
      <div className='self-stretch rounded-boundvariablesdata2 flex flex-row items-center justify-between text-36xl text-white-0'>
        <div className='rounded-boundvariablesdata2 flex flex-col items-start justify-center'>
          <div className='self-stretch relative font-light'>{value}</div>
        </div>
        <div className='self-stretch rounded-boundvariablesdata2 flex flex-row items-center justify-start text-sm'>
          <div className='rounded-boundvariablesdata2 flex flex-col items-start justify-center'>
            <div className='self-stretch relative leading-[18px]'>
              {percentageChange}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UniDataCard
