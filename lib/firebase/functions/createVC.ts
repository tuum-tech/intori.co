import { CredentialDetail } from '@/components/credentials/CredTypes'
import { UserInfo } from '@/lib/magic/user'
import { analytics, auth, functions } from '@/utils/firebase'
import { logEvent } from 'firebase/analytics'
import { httpsCallable } from 'firebase/functions'

type Response = {
  success: boolean
  docIds: string[]
}

export async function createVCFirebase(credentialRows: CredentialDetail[]) {
  // After creating a VC in the frontend, call the Firebase function
  const createVCFunction = httpsCallable(functions, 'createVC')

  const userInfo: UserInfo = JSON.parse(
    localStorage.getItem('userInfo') ?? '{}'
  )
  try {
    const token = await auth.currentUser?.getIdToken(true)
    const response = await createVCFunction({
      authToken: token,
      credentialRows
    })
    const data = response.data as Response
    if (data.success) {
      console.log('Created VC successfully')
      // Log the event to firebase
      if (analytics) {
        logEvent(
          analytics,
          `createVC: successful for user ${userInfo} with IDs: ${data.docIds}`
        )
      }
    }
  } catch (error) {
    console.error('Error creating VC in the backend:', error)
    if (analytics) {
      logEvent(
        analytics,
        `createVC: failure for user ${userInfo} with error: ${error}`
      )
    }
    throw error // If it's another error, re-throw it
  }
}
