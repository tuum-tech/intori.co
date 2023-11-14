import BackButton from '@/components/common/BackButton'
import DateFormatter from '@/components/common/DateFormatter'
import { CredentialDetail } from '@/components/credentials/CredTypes'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import { useDid } from '@/contexts/DidContext'
import {
  mapAgeOfOrderToString,
  mapProductValueRangeToString
} from '@/utils/credValue'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SideNavigationMenu from '../../components/side-navigation/SideNavigationMenu'

const CredentialDetails: NextPage = ({}) => {
  const {
    state: { credentialRows },
    fetchCredentials
  } = useDid()

  const router = useRouter()
  const { id, backToUrl } = router.query

  const [credentialDetail, setCredentialDetail] =
    useState<CredentialDetail | null>(null)

  useEffect(() => {
    if (typeof id === 'string') {
      fetchCredentials({
        query: { 'vCred.metadata.vcMetadata.vcHash': id },
        itemsPerPage: 1
      })
    }
  }, [id, fetchCredentials])

  useEffect(() => {
    const selectedCredential = credentialRows.find(
      (row: CredentialDetail) => String(row.uploadedDataDetail.id) === id
    )

    if (selectedCredential) {
      setCredentialDetail(selectedCredential)
    } else {
      console.log('Invalid id: ', id)
      // If no matching credential found or invalid id, redirect to /credentials.tsx
      router.push('/credentials')
    }
  }, [credentialRows, id, router])

  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu />
      <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-base text-white-1 font-kumbh-sans'>
        <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-base text-white-1 font-kumbh-sans'>
          <TopNavigationMenu />
          <div className='self-stretch flex flex-col items-start justify-start text-left text-base text-white-1 font-kumbh-sans'>
            <BackButton backTo={backToUrl as string} />
          </div>
          {credentialDetail && (
            <>
              <div className='rounded-xl bg-black-2 w-[76px] h-[76px] overflow-hidden shrink-0 flex flex-col items-center justify-center p-2.5 box-border'>
                <img
                  className='relative w-[38px] h-[38px]'
                  alt=''
                  src='/amazonicon1.svg'
                />
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  What is the price range of this order?
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      {mapProductValueRangeToString(
                        credentialDetail.vCred.metadata.productValueRange
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  How old is this order?
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      {mapAgeOfOrderToString(
                        credentialDetail.vCred.metadata.ageOfOrder
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  How much is this credential worth?(According to Intori)
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      ${credentialDetail.vCred.metadata.vcValue}
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  Category
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      {credentialDetail.vCred.metadata.vcData.order.category ||
                        'Not defined'}
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  Ratings
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      {credentialDetail.vCred.metadata.vcData.order.ratings}
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  Credential Type
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      {credentialDetail.vCred.metadata.vcData.credentialType.join(
                        ', '
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  Issued To
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      {credentialDetail.vCred.metadata.vcData.issuedTo}
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  Issued By
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      {credentialDetail.vCred.metadata.vcData.issuedBy}
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  Issued On
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      <DateFormatter
                        dateStr={
                          credentialDetail.vCred.metadata.vcData.issuedDate
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  Expire Date
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      <DateFormatter
                        dateStr={
                          credentialDetail.vCred.metadata.vcData.expiryDate
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4'>
                <div className='self-stretch relative font-semibold'>
                  Where is this credential stored?
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      {credentialDetail.vCred.metadata.vcMetadata.store.includes(
                        'intori'
                      )
                        ? 'Local Browser'
                        : credentialDetail.vCred.metadata.vcMetadata.store.join(
                            ', '
                          )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CredentialDetails
