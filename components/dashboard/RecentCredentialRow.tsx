import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { CredentialDetail } from '../credentials/CredTypes'
import AmazonIconContainer from '../icons/AmazonIcon'
import MoreDotsIconActionContainer from '../icons/MoreDotsIcon'
import CheckboxAction from '../upload/CheckboxAction'

interface RecentCredentialRowProps {
  id: string
  credentialDetail: CredentialDetail
  onSelect: (isSelected: boolean) => void
  isChecked: boolean
  isSelectable?: boolean
}

const RecentCredentialRow: NextPage<RecentCredentialRowProps> = ({
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
      query: { backToUrl: '/dashboard' }
    })
  }

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
            amazonIconContainerWidth='56px'
            amazonIconContainerHeight='56px'
          />
          <div onClick={handleRowClick} className='cursor-pointer'>
            <div className='flex-1 overflow-hidden flex flex-col items-start justify-center gap-[5px]'>
              <div className='relative font-semibold'>
                {credentialDetail.vCred.metadata.vcData.credentialType.join(
                  ', '
                )}{' '}
              </div>
              <div className='self-stretch relative font-medium text-white-1'>
                {credentialDetail.uploadedDataDetail.orderData.name}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='w-[200px] flex flex-row items-center justify-between text-white-1 Small_Tablet:flex'>
        <div className='relative inline-block w-[98px] shrink-0'>
          ${credentialDetail.vCred.metadata.vcValue}
        </div>
        <div className='relative inline-block w-[98px] shrink-0'>
          {credentialDetail.uploadedDataDetail.orderData.amount}
        </div>
        <MoreDotsIconActionContainer moreDotsIconActionContainBoxSizing='border-box' />
      </div>
    </div>
  )
}

export default RecentCredentialRow
