import BiDataCard from '@/components/common/BiDataCard'
import Button from '@/components/common/Button'
import DataTable from '@/components/common/DataTable'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { CredentialDetail } from '@/components/credentials/CredTypes'
import SideNavigationMenu from '@/components/side-navigation/SideNavigationMenu'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import { UploadedDataDetail } from '@/components/upload/UploadedTypes'
import { useDid } from '@/contexts/DidContext'
import { createVCFirebase } from '@/lib/firebase/functions/createVC'
import { VCMetadata } from '@/lib/firebase/functions/getVCs'
import { createVC } from '@/lib/veramo/createVC'
import {
  CreateVCRequestParams,
  CreateVCResponseResult
} from '@/lib/veramo/types/params'
import {
  ensureString,
  ensureStringArray,
  getIdFromIssuer,
  getProductDescription
} from '@/utils/credNormalizer'
import { calculateTotalVCUSDValue } from '@/utils/credValue'
import type { NextPage } from 'next'
import { useEffect, useMemo, useRef, useState } from 'react'

const Credentials: NextPage = () => {
  const [selectedItems, setSelectedItems] = useState([] as CredentialDetail[])
  const [isProcessing, setIsProcessing] = useState({
    generateCreds: false,
    delete: false
  })
  const {
    state: { credentialRows, veramoState },
    dispatch
  } = useDid()
  const isGeneratingCredentials = useRef(false)

  // Calculate the total value of all credentials
  const totalCredentialValue = useMemo(() => {
    return calculateTotalVCUSDValue(credentialRows)
  }, [credentialRows])

  useEffect(() => {
    setIsProcessing((prevState) => ({
      ...prevState,
      generateCreds: true
    }))

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
          sessionStorage.removeItem('selectedItems')
        }
      } catch (error) {
        console.error(
          'Error parsing selected items from sessionStorage:',
          error
        )
      }
    }
    setIsProcessing((prevState) => ({
      ...prevState,
      generateCreds: false
    }))
  }, [dispatch])

  // Logic to generate credentials for each selected item...
  const generateCredentials = async (newCredentials: UploadedDataDetail[]) => {
    const promises = newCredentials.map(async (order: UploadedDataDetail) => {
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

      const credentialRow = { uploadedDataDetail: order } as CredentialDetail
      // Logic to generate verifiable credentials...
      try {
        const vcRequestParams: CreateVCRequestParams = {
          vcKey: 'Order',
          vcValue: {
            productName: credentialRow.uploadedDataDetail.orderData.name,
            store: credentialRow.uploadedDataDetail.orderData.store,
            category: 'TODO',
            description: getProductDescription(
              credentialRow.uploadedDataDetail.orderData.asin
            ),
            orderDate: credentialRow.uploadedDataDetail.orderData.purchasedDate,
            amount: credentialRow.uploadedDataDetail.orderData.amount
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

          credentialRow.vCredMetadata = {
            productValueRange:
              credentialRow.uploadedDataDetail.orderData.productValueRange,
            ageOfOrder: credentialRow.uploadedDataDetail.orderData.ageOfOrder,
            vcValue: credentialRow.uploadedDataDetail.orderData.worth,
            vcHash: credentialRow.uploadedDataDetail.id,
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
        await createVCFirebase([credentialRow.vCredMetadata])
      } catch (error) {
        console.error(`Error while creating a VC: ${error}`)
      }

      return credentialRow
    })

    await Promise.allSettled(promises)
  }

  const handleSelectionChange = (selectedRows: { [key: string]: boolean }) => {
    // Filter the credentialRows to get only those that are selected.
    const newSelectedItems = credentialRows.filter(
      (cred: CredentialDetail) => selectedRows[cred.uploadedDataDetail.id]
    )
    setSelectedItems(newSelectedItems)
  }

  const handleDelete = () => {
    setIsProcessing((prevState) => ({
      ...prevState,
      delete: true
    }))
    const idsToRemove = new Set(
      selectedItems.map((item) => item.uploadedDataDetail.id)
    )
    const newSelectedItems = credentialRows.filter(
      (item) => !idsToRemove.has(item.uploadedDataDetail.id)
    )
    dispatch({ type: 'SET_CREDENTIAL_ROWS', payload: newSelectedItems })
    setSelectedItems([]) // Clear the selected items
    setIsProcessing((prevState) => ({
      ...prevState,
      delete: false
    }))
  }

  if (isProcessing.generateCreds) {
    return (
      <LoadingSpinner loadingText='Generating credentials from your data...' />
    )
  }

  if (isProcessing.delete) {
    return (
      <LoadingSpinner loadingText='Deleting your selected credentials...' />
    )
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
              value={`$${totalCredentialValue.toFixed(2)}`}
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
            isSelectable={true}
            onSelectionChange={handleSelectionChange}
          />
          {/* Conditionally render the Delete button */}
          {selectedItems.length > 0 && (
            <Button
              title='Delete'
              onClick={handleDelete}
              disabled={selectedItems.length === 0} // Button is disabled when no items are selected
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Credentials
