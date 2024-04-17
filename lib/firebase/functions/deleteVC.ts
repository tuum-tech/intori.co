import { analytics, auth, functions } from '@/utils/firebase'
import { logEvent } from 'firebase/analytics'
import { httpsCallable } from 'firebase/functions'

type Response = {
  success: boolean
  deletedVCsHash: string[]
}

export async function deleteVCFirebase(docIds: string[]): Promise<string[]> {
  let deletedVCsHash: string[] = []
  // After creating a VC in the frontend, call the Firebase function
  const deleteVCFunction = httpsCallable(functions, 'deleteVC')

  const userInfo: unknown = JSON.parse(
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
      deletedVCsHash = data.deletedVCsHash
      // Log the event to firebase
      if (analytics) {
        logEvent(
          analytics,
          `deleteVC: successful for user ${userInfo} with VC Hashes: ${JSON.stringify(
            data.deletedVCsHash,
            null,
            4
          )}`
        )
      }
    }
  } catch (error) {
    const errMessage = `Error deleting VC in the backend: ${error}`
    console.error(errMessage)
    if (analytics) {
      logEvent(
        analytics,
        `deleteVC: failure for user ${userInfo} with error: ${errMessage}`
      )
    }
  }
  return deletedVCsHash
}
