import { NextPage } from 'next'
import AmazonIconContainer from '../shared/amazon-icon-container'
import MoreDotsIconActionContainer from '../shared/more-dots-icon-action-container'
import DateFormatter from '../utils/DateFormatter'
import CheckboxAction from './CheckboxAction'
import { OrderData } from './UploadedTypes'

interface UploadedDataRowProps {
  id: string
  orderData: OrderData
  onSelect: (isSelected: boolean) => void
  isChecked: boolean
  isSelectable?: boolean
}

const UploadedDataRow: NextPage<UploadedDataRowProps> = ({
  id,
  orderData,
  onSelect,
  isChecked,
  isSelectable
}) => {
  console.log('orderData: ', orderData)
  const handleCheckboxChange = () => {
    onSelect(!isChecked)
  }

  return (
    <div className='self-stretch rounded-mini flex flex-row items-start justify-start py-3 px-6 gap-[31px] text-left text-xs text-white-1 font-kumbh-sans'>
      <div className='self-stretch flex flex-row items-start justify-start'>
        {isSelectable && (
          <CheckboxAction
            boxSizing='border-box'
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        )}
      </div>
      <div className='flex-1 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0'>
        <div className='overflow-hidden flex flex-row items-start justify-start py-0 pr-[7px] pl-0 box-border gap-[20px] max-w-[500px] text-left text-xs text-white-0 font-kumbh-sans flex-1'>
          <AmazonIconContainer
            amazonIconContainerFlexShrink='0'
            amazonIconContainerWidth='46px'
            amazonIconContainerHeight='46px'
          />
          <div className='flex-1 overflow-hidden flex flex-col items-start justify-center gap-[5px]'>
            <div className='relative font-semibold'>{orderData.name}</div>
            <div className='self-stretch relative text-white-1'>
              {orderData.description}
            </div>
          </div>
        </div>
      </div>
      <div className='w-[333px] flex flex-row items-center justify-between'>
        <div className='relative inline-block w-[70px] shrink-0'>
          {orderData.amount}
        </div>
        <div className='relative inline-block w-[90px] shrink-0'>
          <DateFormatter dateStr={orderData.purchasedDate} />
        </div>
        <div className='relative inline-block w-[90px] shrink-0'>
          <DateFormatter dateStr={orderData.uploadedDate} />
        </div>
        <MoreDotsIconActionContainer moreDotsIconActionContainBoxSizing='border-box' />
      </div>
    </div>
  )
}

export default UploadedDataRow
