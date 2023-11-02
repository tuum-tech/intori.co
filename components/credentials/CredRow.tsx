import { NextPage } from 'next'
import { useRouter } from 'next/router'
import DateFormatter from '../common/DateFormatter'
import AmazonIconContainer from '../icons/AmazonIcon'
import MoreDotsIconActionContainer from '../icons/MoreDotsIcon'
import CheckboxAction from '../upload/CheckboxAction'
import { CredentialDetail } from './CredTypes'

interface CredRowProps {
  id: string
  credentialDetail: CredentialDetail
  onSelect: (isSelected: boolean) => void
  isChecked: boolean
  isSelectable?: boolean
}

const CredRow: NextPage<CredRowProps> = ({
  id,
  credentialDetail,
  onSelect,
  isChecked,
  isSelectable
}) => {
  const router = useRouter()

  const handleRowClick = () => {
    router.push({
      pathname: `/credential-details/${id}`,
      query: { backToUrl: '/credentials' }
    })
  }

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
          <div onClick={handleRowClick} className='cursor-pointer'>
            <div className='flex-1 overflow-hidden flex flex-col items-start justify-center gap-[5px]'>
              <div className='relative font-semibold'>
                {credentialDetail.vCredMetadata.vcData.credentialType.join(
                  ', '
                )}
              </div>
              <div className='self-stretch relative text-white-1'>
                {credentialDetail.uploadedDataDetail.orderData.description}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-[400px] flex flex-row items-center justify-between'>
        <div className='relative inline-block w-[98px] shrink-0'>
          ${credentialDetail.vCredMetadata.vcValue}
        </div>
        <div className='relative inline-block w-[98px] shrink-0'>
          {credentialDetail.uploadedDataDetail.orderData.amount}
        </div>
        <div className='relative inline-block w-[98px] shrink-0'>
          <DateFormatter
            dateStr={credentialDetail.vCredMetadata.vcData.issuedDate}
          />
        </div>
        <div className='relative inline-block w-[98px] shrink-0'>
          <DateFormatter
            dateStr={credentialDetail.vCredMetadata.vcData.expiryDate}
          />
        </div>
        <MoreDotsIconActionContainer moreDotsIconActionContainBoxSizing='border-box' />
      </div>
    </div>
  )
}

export default CredRow
