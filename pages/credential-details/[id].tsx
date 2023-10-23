import BackButton from '@/components/common/BackButton'
import { CredentialDetail } from '@/components/credentials/CredTypes'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import DateFormatter from '@/components/utils/DateFormatter'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SideNavigationMenu from '../../components/side-navigation/SideNavigationMenu'

interface CredentialDetailsProps {
  credentialType: string
  value: string
  issuedDate: string
  expireDate: string
  description: string
}

const CredentialDetails: NextPage<CredentialDetailsProps> = ({
  credentialType,
  value,
  issuedDate,
  expireDate,
  description
}) => {
  const router = useRouter()
  const { id } = router.query

  const [credentialDetail, setCredentialDetail] =
    useState<CredentialDetail | null>(null)

  useEffect(() => {
    const storedData = localStorage.getItem('credentials')
    const credentialRows = storedData ? JSON.parse(storedData) : []
    const selectedCredential = credentialRows.find(
      (row: CredentialDetail) => String(row.id) === id
    )

    if (selectedCredential) {
      setCredentialDetail(selectedCredential)
    } else {
      console.log('Invalid id: ', id)
      // If no matching credential found or invalid id, redirect to /credentials.tsx
      router.push('/credentials')
    }
  }, [id, router])

  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu />
      <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-base text-white-1 font-kumbh-sans'>
        <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-base text-white-1 font-kumbh-sans'>
          <TopNavigationMenu />
          <div className='self-stretch flex flex-col items-start justify-start text-left text-base text-white-1 font-kumbh-sans'>
            <BackButton backTo='/credentials' />
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
                  Credential Description
                </div>
                <div className='self-stretch flex flex-row items-center justify-between text-sm text-grey-2'>
                  <div className='flex-1 flex flex-col items-start justify-start'>
                    <div className='self-stretch relative leading-[150%]'>
                      {credentialDetail.verifiableCredential.description}
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
                      {credentialDetail.verifiableCredential.vcIssuedBy}
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
                          credentialDetail.verifiableCredential.vcIssuedDate
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
                          credentialDetail.verifiableCredential.vcExpiryDate
                        }
                      />
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
