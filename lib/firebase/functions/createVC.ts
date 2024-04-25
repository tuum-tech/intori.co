// import { CredentialDetail } from '@/components/credentials/CredTypes'
import { analytics, auth, functions } from '@/utils/firebase'
import { logEvent } from 'firebase/analytics'
import { httpsCallable } from 'firebase/functions'

type CredentialDetail = unknown

type Response = {
  success: boolean
  newDocIds: string[]
  newVCsHash: string[]
  duplicateVCsHash: string[]
}

export async function createVCFirebase(
  credentialRows: CredentialDetail[]
): Promise<Response> {
  let result: Response = {} as Response

  // After creating a VC in the frontend, call the Firebase function
  const createVCFunction = httpsCallable(functions, 'createVC')

  const userInfo = JSON.parse(
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
      console.log('Created VCs successfully')
      result = data
      // Log the event to firebase
      if (analytics) {
        logEvent(
          analytics,
          `createVC: successful for user ${userInfo} with VC Hashes: ${JSON.stringify(
            data.newVCsHash,
            null,
            4
          )}`
        )
      }
      if (data.duplicateVCsHash.length > 0) {
        console.error(
          `Some of the VCs you generated were duplicates so they were not saved: ${data.duplicateVCsHash.length}`
        )
        if (analytics) {
          logEvent(
            analytics,
            `createVC: failure for user ${userInfo} with error: Some of the VCs you generated were duplicates so they were not saved: ${JSON.stringify(
              data.duplicateVCsHash,
              null,
              4
            )}`
          )
        }
      }
    } else {
      const errMessage = 'Error creating VC in the backend. Please try again'
      console.error(errMessage)
      if (analytics) {
        logEvent(
          analytics,
          `createVC: failure for user ${userInfo} with error: ${errMessage}`
        )
      }
      throw new Error(errMessage)
    }
  } catch (error) {
    const errMessage = `Error creating VC in the backend: ${error}`
    console.error(errMessage)
    if (analytics) {
      logEvent(
        analytics,
        `createVC: failure for user ${userInfo} with error: ${errMessage}`
      )
    }
  }
  return result
}
