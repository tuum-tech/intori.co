import { NextPage } from 'next'
import DateFormatter from '../common/DateFormatter'
import AmazonIconContainer from '../icons/AmazonIcon'
import MoreDotsIconActionContainer from '../icons/MoreDotsIcon'
import CheckboxAction from './CheckboxAction'
import { OrderData } from './UploadedTypes'

interface UploadedDataRowProps {
  orderData: OrderData
  onSelect: (isSelected: boolean) => void
  isChecked: boolean
  isSelectable?: boolean
}

const UploadedDataRow: NextPage<UploadedDataRowProps> = ({
  orderData,
  onSelect,
  isChecked,
  isSelectable
}) => {
  const handleCheckboxChange = () => {
    onSelect(!isChecked)
  }

  return (
    <div className='self-stretch rounded-mini flex flex-row items-start justify-start py-3 px-6 gap-[31px]'>
      <div className='self-stretch flex flex-row items-start justify-start Small_Tablet:flex'>
        {isSelectable && (
          <CheckboxAction
            boxSizing='border-box'
            isChecked={isChecked}
            handleCheckboxChange={handleCheckboxChange}
          />
        )}
      </div>
      <div className='flex-1 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0'>
        <div className='flex-1 overflow-hidden flex flex-row items-start justify-start py-0 pr-[7px] pl-0 box-border gap-[20px] max-w-[500px]'>
          <AmazonIconContainer
            amazonIconContainerFlexShrink='0'
            amazonIconContainerWidth='46px'
            amazonIconContainerHeight='46px'
          />
          <div className='flex-1 overflow-hidden flex flex-col items-start justify-center gap-[5px]'>
            <div className='relative font-semibold'>
              {orderData.store} Order
            </div>
            <div className='self-stretch relative text-white-1'>
              {orderData.name}
            </div>
          </div>
        </div>
      </div>
      <div className='w-[400px] flex flex-row items-center justify-between text-white-1 Small_Tablet:flex'>
        <div className='relative inline-block w-[98px] shrink-0'>
          ${orderData.worth}
        </div>
        <div className='relative inline-block w-[98px] shrink-0'>
          {orderData.amount}
        </div>
        <div className='relative inline-block w-[98px] shrink-0'>
          <DateFormatter dateStr={orderData.purchasedDate} />
        </div>
        <div className='relative inline-block w-[98px] shrink-0'>
          <DateFormatter dateStr={orderData.uploadedDate} />
        </div>
        <MoreDotsIconActionContainer moreDotsIconActionContainBoxSizing='border-box' />
      </div>
    </div>
  )
}

export default UploadedDataRow
