import BiDataCard from '@/components/common/BiDataCard'
import Button from '@/components/common/Button'
import DataTable from '@/components/common/DataTable'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import SideNavigationMenu from '@/components/side-navigation/SideNavigationMenu'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import UploadDataButton from '@/components/upload/UploadDataButton'
import { UploadedDataDetail } from '@/components/upload/UploadedTypes'
import { useDid } from '@/contexts/DidContext'
import { uploadFileFirebase } from '@/lib/firebase/functions/uploadFile'
import { calculateTotalVCUSDValue } from '@/utils/credValue'
import axios from 'axios'
import _ from 'lodash'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

const Upload: NextPage = () => {
  // State to hold the uploaded data
  const [uploadedDataRows, setUploadedDataRows] = useState(
    [] as UploadedDataDetail[]
  )
  const [selectedItems, setSelectedItems] = useState([] as UploadedDataDetail[])
  const [isProcessing, setIsProcessing] = useState(false)

  const { dispatch } = useDid()

  const router = useRouter()

  // Calculate the total value of all the selected items
  const totalSelectedValue = useMemo(() => {
    return calculateTotalVCUSDValue(selectedItems)
  }, [selectedItems])

  // Handler function for file selection
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true)

    // Use FormData to store file for sending
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data && response.data.data) {
        const newData = response.data.data as UploadedDataDetail[]

        // Get the existing IDs to avoid adding duplicates
        const existingIds = new Set(uploadedDataRows.map((item) => item.id))

        // Combine old and new data, then filter out duplicates based on unique ID
        const combinedData = [...uploadedDataRows, ...newData]
        const uniqueData = _.uniqBy(combinedData, 'id').filter(
          (item) => !existingIds.has(item.id)
        )

        // Update the state with the unique data only
        setUploadedDataRows(uniqueData)

        // Update the backend database with the upload stats
        // Here, you should only count the new unique items that were not already in the state
        const newUniqueItemCount = uniqueData.length - uploadedDataRows.length
        if (newUniqueItemCount > 0) {
          await uploadFileFirebase(newUniqueItemCount)
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }

    setIsProcessing(false)
  }

  const handleSelectionChange = (selectedRows: { [key: string]: boolean }) => {
    // Filter the uploadedDataRows to get only those that are selected.
    const newSelectedItems = uploadedDataRows.filter(
      (row) => selectedRows[row.id]
    )
    setSelectedItems(newSelectedItems)
  }

  // Navigate to the /credentials page
  const handleContinue = () => {
    // Save the selected items to sessionStorage before navigating
    if (selectedItems.length > 0) {
      sessionStorage.setItem('selectedItems', JSON.stringify(selectedItems))
    }
    // Clear the uploadedDataRows and selectedItems state
    setUploadedDataRows([])
    setSelectedItems([])

    // Update the context state to indicate that credential generation is in progress
    dispatch({ type: 'SET_GENERATING_CREDENTIALS', payload: true })
    router.push('/credentials')
  }

  if (isProcessing) {
    return <LoadingSpinner loadingText='Uploading your file...' />
  }

  return (
    <div className='relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start'>
      <SideNavigationMenu />
      <div className='self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-lg text-white-1 font-kumbh-sans'>
        <div className='w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-lg text-white-1 font-kumbh-sans'>
          <TopNavigationMenu />
          <div className='self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans'>
            <BiDataCard
              title='Data Value'
              value={`$${totalSelectedValue.toFixed(2)}`}
            />
            <BiDataCard
              title='Items Selected'
              value={`${selectedItems.length}/${uploadedDataRows.length}`}
            />
          </div>
          <DataTable
            title='Current data upload'
            titleContainers={[
              <UploadDataButton
                key='upload-data-button'
                onFileSelect={handleFileSelect}
              />
            ]}
            isCredentialType={false}
            rows={uploadedDataRows}
            isSelectable={true}
            onSelectionChange={handleSelectionChange}
          />
          {/* Conditionally render the Continue button */}
          {uploadedDataRows.length > 0 && (
            <Button
              title='Continue'
              onClick={handleContinue}
              disabled={selectedItems.length === 0} // Button is disabled when no items are selected
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload
