import { UserInfo } from '@/lib/magic/user'
import { analytics, auth, functions } from '@/utils/firebase'
import { logEvent } from 'firebase/analytics'
import { httpsCallable } from 'firebase/functions'

type Response = {
  success: boolean
  deletedDocIds: string[]
}

export async function deleteVCFirebase(docIds: string[]) {
  // After creating a VC in the frontend, call the Firebase function
  const deleteVCFunction = httpsCallable(functions, 'deleteVC')

  const userInfo: UserInfo = JSON.parse(
    localStorage.getItem('userInfo') ?? '{}'
  )
  try {
    const token = await auth.currentUser?.getIdToken(true)
    const response = await deleteVCFunction({
      authToken: token,
      docIds
    })
    const data = response.data as Response
    if (data.success) {
      console.log('Deleted VCs successfully')
      // Log the event to firebase
      if (analytics) {
        logEvent(
          analytics,
          `deleteVC: successful for user ${userInfo} with IDs: ${data.deletedDocIds}`
        )
      }
    }
  } catch (error) {
    console.error('Error creating VC in the backend:', error)
    if (analytics) {
      logEvent(
        analytics,
        `deleteVC: failure for user ${userInfo} with error: ${error}`
      )
    }
    throw error // If it's another error, re-throw it
  }
}
