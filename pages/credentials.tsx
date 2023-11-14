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
import {
  TotalStats,
  getUserStatsFirebase
} from '@/lib/firebase/functions/getUserStats'
import { VCMetadata } from '@/lib/firebase/functions/getVCs'
import { createVC } from '@/lib/veramo/createVC'
import {
  CreateVCRequestParams,
  CreateVCResponseResult
} from '@/lib/veramo/types/params'
import {
  ensureString,
  ensureStringArray,
  getIdFromIssuer
} from '@/utils/credNormalizer'
import { calculateTotalVCUSDValue } from '@/utils/credValue'
import type { NextPage } from 'next'
import { useEffect, useMemo, useRef, useState } from 'react'

const Credentials: NextPage = () => {
  const [totalStats, setTotalStats] = useState<TotalStats>({
    totalUsers: 0,
    userStats: {
      uploadedFiles: 0,
      ordersProcessed: 0,
      vcsCreated: 0
    },
    appStats: {
      uploadedFiles: 0,
      ordersProcessed: 0,
      vcsCreated: 0
    }
  })

  const [selectedItems, setSelectedItems] = useState([] as CredentialDetail[])
  const [isProcessing, setIsProcessing] = useState({
    generateCreds: false,
    delete: false
  })
  const {
    state: { credentialRows, veramoState },
    fetchCredentials
  } = useDid()
  const isGeneratingCredentials = useRef(false)

  const totalCredentialValue = useMemo(() => {
    return calculateTotalVCUSDValue(credentialRows)
  }, [credentialRows])

  useEffect(() => {
    getUserStatsFirebase().then(setTotalStats).catch(console.error)
  }, [credentialRows])

  useEffect(() => {
    fetchCredentials({ self: true, itemsPerPage: 50, fetchEverything: true })
  }, [fetchCredentials])

  useEffect(() => {
    const fetchAndFilterCredentials = async () => {
      setIsProcessing((prevState) => ({
        ...prevState,
        generateCreds: true
      }))

      // Retrieve the selected items from sessionStorage
      const storedSelectedUploadedData = sessionStorage.getItem('selectedItems')
      if (storedSelectedUploadedData) {
        try {
          // Create a set of existing ids for quick lookup
          const existingOrderIds = new Set(
            credentialRows.map((cred) => cred.vCred.metadata.vcMetadata.vcHash)
          )

          const selectedUploadedData = JSON.parse(
            storedSelectedUploadedData
          ) as UploadedDataDetail[]
          const newCredentials = selectedUploadedData.filter(
            (item: UploadedDataDetail) => !existingOrderIds.has(item.id)
          )

          // Now generate credentials for the selected items
          if (newCredentials.length > 0 && !isGeneratingCredentials.current) {
            isGeneratingCredentials.current = true
            await generateCredentials(newCredentials)
            isGeneratingCredentials.current = false
          }

          sessionStorage.removeItem('selectedItems')
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
    }

    fetchAndFilterCredentials()
  }, [credentialRows])

  // Logic to generate credentials for each selected item...
  const generateCredentials = async (
    selectedUploadedData: UploadedDataDetail[]
  ) => {
    const batchedVcs: CredentialDetail[][] = []
    let currentBatchVcs: CredentialDetail[] = []

    const batchSize = 200

    const promises = selectedUploadedData.map(
      async (order: UploadedDataDetail) => {
        const credentialRow = { uploadedDataDetail: order } as CredentialDetail
        // Logic to generate verifiable credentials...
        try {
          const vcRequestParams: CreateVCRequestParams = {
            vcKey: 'Order',
            vcValue: {
              productName: credentialRow.uploadedDataDetail.orderData.name,
              asin: credentialRow.uploadedDataDetail.orderData.asin,
              description:
                credentialRow.uploadedDataDetail.orderData.description,
              category: credentialRow.uploadedDataDetail.orderData.category,
              brandName: credentialRow.uploadedDataDetail.orderData.brandName,
              ratings: credentialRow.uploadedDataDetail.orderData.ratings,
              store: credentialRow.uploadedDataDetail.orderData.store,
              orderDate:
                credentialRow.uploadedDataDetail.orderData.purchasedDate,
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

            const vcMetadata = {
              productValueRange:
                credentialRow.uploadedDataDetail.orderData.productValueRange,
              ageOfOrder: credentialRow.uploadedDataDetail.orderData.ageOfOrder,
              vcValue: credentialRow.uploadedDataDetail.orderData.worth,
              vcData: {
                order: {
                  category: saved.data.credentialSubject['Order'].category,
                  ratings: saved.data.credentialSubject['Order'].ratings,
                  store: saved.data.credentialSubject['Order'].store
                },
                credentialType: ensureStringArray(saved.data.type),
                issuedTo: ensureString(saved.data.credentialSubject.id),
                issuedBy: getIdFromIssuer(saved.data.issuer),
                issuedDate: saved.data.issuanceDate,
                expiryDate: ensureString(saved.data.expirationDate)
              },
              vcMetadata: {
                id: saved.metadata.id,
                vcHash: credentialRow.uploadedDataDetail.id,
                store: ensureStringArray(saved.metadata.store)
              }
            } as VCMetadata

            credentialRow.vCred = {
              data: saved.data,
              metadata: vcMetadata
            }
          }
        } catch (error) {
          console.error(`Error while creating a VC: ${error}`)
          return null
        }

        currentBatchVcs.push(credentialRow)
        if (currentBatchVcs.length >= batchSize) {
          batchedVcs.push(currentBatchVcs)
          currentBatchVcs = []
        }
      }
    )

    await Promise.allSettled(promises)

    // Push the last batch if it has any items
    if (currentBatchVcs.length > 0) {
      batchedVcs.push(currentBatchVcs)
    }

    // Now we have an array of batches to be sent to Firebase
    for (let i = 0; i < batchedVcs.length; i++) {
      try {
        const vcBatch = batchedVcs[i]
        await createVCFirebase(vcBatch)
      } catch (error) {
        console.error(`Error while uploading VCs to firebase: ${error}`)
      }
    }
    await fetchCredentials()
  }

  const handleSelectionChange = (selectedRows: { [key: string]: boolean }) => {
    // Filter the credentialRows to get only those that are selected.
    const newSelectedItems = credentialRows.filter(
      (cred: CredentialDetail) => selectedRows[cred.uploadedDataDetail.id]
    )
    setSelectedItems(newSelectedItems)
  }

  const handleDelete = async () => {
    setIsProcessing((prevState) => ({
      ...prevState,
      delete: true
    }))
    // TODO: Handle removal of VC from the database
    /* const idsToRemove = new Set(
      selectedItems.map((item) => item.uploadedDataDetail.id)
    )
    const newSelectedItems = credentialRows.filter(
      (item) => !idsToRemove.has(item.uploadedDataDetail.id)
    ) */
    await fetchCredentials()
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
              title='Estimated Credential Value'
              value={`$${totalCredentialValue.toFixed(2)}`}
            />
            <BiDataCard
              title='Local Credentials'
              value={`${totalStats.userStats.vcsCreated}`}
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
