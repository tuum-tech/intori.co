import BiDataCard from '@/components/common/BiDataCard'
import DataTable from '@/components/common/DataTable'
import { CredentialDetail } from '@/components/credentials/CredTypes'
import SideNavigationMenu from '@/components/side-navigation/SideNavigationMenu'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import { UploadedDataDetail } from '@/components/upload/UploadedTypes'
import { useDid } from '@/contexts/DidContext'
import {
  AgeOfOrder,
  ProductValueRange,
  VCMetadata
} from '@/lib/firebase/functions/getVCs'
import { createVC } from '@/lib/veramo/createVC'
import {
  CreateVCRequestParams,
  CreateVCResponseResult
} from '@/lib/veramo/types/params'
import {
  calculateAgeInMonths,
  ensureString,
  ensureStringArray,
  getIdFromIssuer,
  getProductDescription
} from '@/utils/normalizer'
import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'

const Credentials: NextPage = () => {
  const {
    state: { credentialRows, veramoState },
    dispatch
  } = useDid()
  const isGeneratingCredentials = useRef(false)

  useEffect(() => {
    const storedSelectedItems = sessionStorage.getItem('selectedItems')
    if (storedSelectedItems) {
      try {
        const selectedItems = JSON.parse(storedSelectedItems)
        const existingOrderIds = new Set(
          credentialRows.map((cred) => cred.uploadedDataDetail.id)
        )

        const newCredentials = selectedItems.filter(
          (item: UploadedDataDetail) => !existingOrderIds.has(item.id)
        )

        if (newCredentials.length > 0 && !isGeneratingCredentials.current) {
          isGeneratingCredentials.current = true
          generateCredentials(newCredentials).finally(() => {
            isGeneratingCredentials.current = false
          })
        }
      } catch (error) {
        console.error(
          'Error parsing selected items from sessionStorage:',
          error
        )
      }
    }
  }, [dispatch])

  // Logic to generate credentials for each selected item...
  const generateCredentials = async (newCredentials: UploadedDataDetail[]) => {
    const promises = newCredentials.map(
      async (order: UploadedDataDetail, index: number) => {
        console.log('Rendering credential:', order, 'at index:', index)

        // Check if there's an existing credential for this order
        const existingCredential = credentialRows.find((cred) => {
          return (
            JSON.stringify(cred.uploadedDataDetail.orderData) ===
            JSON.stringify(order.orderData)
          )
        })

        // If a credential already exists, return null
        if (existingCredential) {
          return null
        }

        const credentialRow = {} as CredentialDetail
        credentialRow.uploadedDataDetail = order
        // Logic to generate verifiable credentials...
        try {
          const vcRequestParams: CreateVCRequestParams = {
            vcKey: 'Order',
            vcValue: {
              productName: order.orderData.name,
              store: order.orderData.store,
              category: 'TODO',
              description: getProductDescription(order.orderData.store), // change this to order.orderData.asin
              orderDate: order.orderData.purchasedDate,
              amount: order.orderData.amount
            },
            credTypes: ['OrderCredential']
          }
          const saved: CreateVCResponseResult = (await createVC(
            veramoState,
            vcRequestParams
          )) as CreateVCResponseResult
          if (saved) {
            console.log('Created a VC: ', saved)

            credentialRow.vCred = saved

            const totalOwed = parseFloat(order.orderData.amount)
            let productValueRange = -1
            if (order.orderData.amount.trim().split(/\s+/).pop() === 'USD') {
              productValueRange = isNaN(totalOwed)
                ? -1
                : totalOwed > 100
                ? ProductValueRange.GreaterThanHundred
                : totalOwed > 50
                ? ProductValueRange.BetweenFiftyAndHundred
                : ProductValueRange.LessThanFifty
            }

            const ageInMonths = calculateAgeInMonths(
              order.orderData.purchasedDate
            )
            let ageOfOrder =
              ageInMonths === -1
                ? -1
                : ageInMonths > 12
                ? AgeOfOrder.GreaterThanOneYear
                : ageInMonths > 6
                ? AgeOfOrder.BetweenSixAndTwelveMonths
                : AgeOfOrder.LessThanSixMonths
            credentialRow.vCredMetadata = {
              productValueRange,
              ageOfOrder,
              vcData: {
                order: {
                  store: saved.data.credentialSubject['Order'].store,
                  category: saved.data.credentialSubject['Order'].category
                },
                credentialType: ensureStringArray(saved.data.type),
                issuedTo: ensureString(saved.data.credentialSubject.id),
                issuedBy: getIdFromIssuer(saved.data.issuer),
                issuedDate: saved.data.issuanceDate,
                expiryDate: ensureString(saved.data.expirationDate)
              },
              vcMetadata: {
                id: saved.metadata.id,
                store: ensureStringArray(saved.metadata.store)
              }
            } as VCMetadata
          }
          // Dispatch the action to add a new credential row
          dispatch({ type: 'ADD_CREDENTIAL_ROW', payload: credentialRow })
        } catch (error) {
          console.error(`Error while creating a VC: ${error}`)
        }

        return credentialRow
      }
    )

    await Promise.allSettled(promises)
  }

  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu />
      <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-lg text-white-1 font-kumbh-sans'>
        <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-lg text-white-1 font-kumbh-sans'>
          <TopNavigationMenu />
          <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
            <BiDataCard
              title='Total Credential Value'
              value='$0.00'
              percentageChange='+0.00%'
            />
            <BiDataCard
              title='Total Credentials'
              value={`${credentialRows.length}`}
            />
          </div>
          <DataTable
            title='Your credentials'
            isCredentialType={true}
            rows={credentialRows}
            isSelectable={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Credentials
