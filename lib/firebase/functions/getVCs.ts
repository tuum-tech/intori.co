import { UserInfo } from '@/lib/magic/user'
import { logEvent } from 'firebase/analytics'
import { httpsCallable } from 'firebase/functions'
import { analytics, auth, functions } from '../../../utils/firebase'

export enum ProductValueRange {
  Invalid,
  LessThanFifty,
  BetweenFiftyAndHundred,
  GreaterThanHundred
}

export enum AgeOfOrder {
  Invalid,
  LessThanSixMonths,
  BetweenSixAndTwelveMonths,
  GreaterThanOneYear
}

export type VCMetadata = {
  productValueRange: ProductValueRange
  ageOfOrder: AgeOfOrder
  vcValue: number
  vcHash: string
  vcData: {
    order: {
      category: string
      ratings: number
      store: string
    }
    credentialType: string[]
    issuedTo: string
    issuedBy: string
    issuedDate: string
    expiryDate: string
  }
  vcMetadata: {
    id: string
    store: string[]
  }
}

export type Response = {
  success: boolean
  vcs: VCMetadata[]
}

export async function getVCsFirebase(
  self: boolean = true,
  startAfterDoc?: string
): Promise<VCMetadata[]> {
  let vcMetadataArray = [] as VCMetadata[]
  // After parsing, call the Firebase function
  const userInfo: UserInfo = JSON.parse(
    localStorage.getItem('userInfo') ?? '{}'
  )
  const getVCsFunction = httpsCallable(functions, 'getVCs')
  try {
    const token = await auth.currentUser?.getIdToken(true)
    const params = {
      authToken: token,
      uid: '',
      startAfterDoc: startAfterDoc ?? null
    }
    if (self) {
      params.uid = auth.currentUser?.uid as string
    }
    const response = await getVCsFunction(params)
    const result = response.data as Response
    if (result.success) {
      console.log('Retrieved my VCs successfully')
      // Log the event to firebase
      if (analytics) {
        logEvent(analytics, `getVCs: successful for user ${userInfo}`)
      }
      vcMetadataArray = result.vcs
    }
  } catch (error) {
    console.error(`Error retrieving my VCs: ${error}`)
    // Log the event to firebase
    if (analytics) {
      logEvent(analytics, `getMyVCs: failure for user ${userInfo}: ${error}`)
    }
  }
  return vcMetadataArray
}
