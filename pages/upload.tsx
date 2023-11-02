import BiDataCard from '@/components/common/BiDataCard'
import Button from '@/components/common/Button'
import DataTable from '@/components/common/DataTable'
import SideNavigationMenu from '@/components/side-navigation/SideNavigationMenu'
import TopNavigationMenu from '@/components/top-navigation/TopNavigationMenu'
import UploadDataButton from '@/components/upload/UploadDataButton'
import { UploadedDataDetail } from '@/components/upload/UploadedTypes'
import { analytics, auth, functions } from '@/utils/firebase'
import axios from 'axios'
import { logEvent } from 'firebase/analytics'
import { httpsCallable } from 'firebase/functions'
import { MagicUserMetadata } from 'magic-sdk'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

type Response = {
  success: boolean
}

const Upload: NextPage = () => {
  // State to hold the uploaded data
  const [uploadedDataRows, setUploadedDataRows] = useState(
    [] as UploadedDataDetail[]
  )
  const [selectedItems, setSelectedItems] = useState([] as UploadedDataDetail[])

  const router = useRouter()

  // Calculate the total value of all the selected items
  const totalSelectedValue = useMemo(() => {
    return selectedItems.reduce((total, selectedItem) => {
      return total + (selectedItem.orderData.worth || 0)
    }, 0)
  }, [selectedItems])

  // Handler function for file selection
  const handleFileSelect = async (file: File) => {
    // Use FormData to store file for sending
    const formData = new FormData()
    formData.append('file', file)

    // Reset the current uploaded data state before uploading the new file
    setUploadedDataRows([])

    // Post the form data to the upload endpoint
    try {
      const response = await axios.post('/api/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.data && response.data.data) {
        // After parsing, call the Firebase function
        const userInfo: MagicUserMetadata = JSON.parse(
          localStorage.getItem('magicUserInfo') || '{}'
        ) as MagicUserMetadata
        const uploadFileFunction = httpsCallable(functions, 'uploadFile')
        try {
          const token = await auth.currentUser?.getIdToken(true)
          const response = await uploadFileFunction({ authToken: token })
          const success = (response.data as Response).success

          if (success) {
            console.log('File uploaded successfully')
            if (analytics) {
              // Log the event to firebase
              logEvent(analytics, `fileUpload: successful for user ${userInfo}`)
            }
          }
        } catch (error) {
          console.error(
            'Error while calling firebase function for uploadFile:',
            error
          )
          if (analytics) {
            // Log the event to firebase
            logEvent(
              analytics,
              `fileUpload: failure for user ${userInfo}: ${error}`
            )
          }
        }
        setUploadedDataRows(response.data.data)
      }
    } catch (error) {
      console.error('Error uploading the file:', error)
      if (analytics) {
        // Log the event to firebase
        logEvent(
          analytics,
          `fileUpload: failure while uploading the file: ${error}`
        )
      }
    }
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
    router.push('/credentials')
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
