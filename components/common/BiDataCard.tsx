import { NextPage } from 'next'

type BiDataCardProps = {
  title: string
  value: string | number
  percentageChange?: string
}

const BiDataCard: NextPage<BiDataCardProps> = ({
  title,
  value
}) => {
  return (
    <div className='flex-1 rounded-mini bg-black-1 box-border min-h-[200px] justify-between flex flex-col pt-6 pb-6 pr-6 pl-12 md:pl-6 gap-[24px] min-w-[300px] text-white-1 border-[1px] border-solid border-black-4'>
      <div className='rounded-boundvariablesdata2 '>
        {title}
      </div>
      <div className='rounded-boundvariablesdata2 sm:text-9xl text-36xl text-white'>
        {value}
      </div>
    </div>
  )
}

export default BiDataCard
