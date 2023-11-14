import { CredentialDetail } from '@/components/credentials/CredTypes'
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
    vcHash: string
    store: string[]
  }
}

export type Response = {
  success: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vcs: any[]
}

async function fetchAllVCsRecursive(
  options: {
    self: boolean
    query: { [key: string]: string }
    itemsPerPage: number
    fetchEverything: boolean
    startAfterDoc?: string | null
  },
  accumulatedVCs: CredentialDetail[] = []
): Promise<CredentialDetail[]> {
  const token = await auth.currentUser?.getIdToken(true)
  const params = {
    authToken: token,
    query: options.query ?? {},
    itemsPerPage: options.itemsPerPage ?? 5,
    startAfterDoc: options.startAfterDoc
  }

  if (options.self) {
    params.query['uid'] = auth.currentUser?.uid as string
  }

  const getVCsFunction = httpsCallable(functions, 'getVCs')

  const response = await getVCsFunction(params)
  const result = response.data as Response

  if (!result.success) {
    console.error('Failed to fetch VCs')
    // Log the event to firebase
    if (analytics) {
      logEvent(
        analytics,
        `getVCsFirebase: failure for user: ${auth.currentUser?.uid}: Failed to fetch VCs`
      )
    }

    throw new Error('Failed to fetch VCs')
  }

  const newVCs = result.vcs
  const newAccumulatedVCs = accumulatedVCs.concat(newVCs)

  if (!options.fetchEverything || newVCs.length === 0) {
    // No more documents to fetch
    return newAccumulatedVCs
  }

  // Use the last document ID as the starting point for the next fetch
  const lastDocId = newVCs[newVCs.length - 1].id
  return fetchAllVCsRecursive(
    { ...options, startAfterDoc: lastDocId },
    newAccumulatedVCs
  )
}

export async function getVCsFirebase(options: {
  self: boolean
  query: { [key: string]: string }
  itemsPerPage: number
  fetchEverything: boolean
}): Promise<CredentialDetail[]> {
  return fetchAllVCsRecursive(options)
}
