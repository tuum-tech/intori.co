import { UserInfo } from '@/lib/magic/user'
import { analytics, auth, functions } from '@/utils/firebase'
import { logEvent } from 'firebase/analytics'
import { httpsCallable } from 'firebase/functions'

type Response = {
  success: boolean
}

export async function uploadFileFirebase(
  totalOrdersProcessed: number
): Promise<void> {
  try {
    // After parsing, call the Firebase function
    const userInfo: UserInfo = JSON.parse(
      localStorage.getItem('userInfo') || '{}'
    )
    const uploadFileFunction = httpsCallable(functions, 'uploadFile')
    try {
      const token = await auth.currentUser?.getIdToken(true)
      const response = await uploadFileFunction({
        authToken: token,
        totalOrdersProcessed
      })
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
