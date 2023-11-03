import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../../../utils/firebase'

export type UserData = {
  uid: string
  email: string
  emailVerified: boolean
  did: string
  publicAddress: string
  loginCount: number
  filesUploaded: number
  totalOrdersProcessed: number
  totalVCs: number
}

export type AppStat = {
  totalUsers: 0
  totalUploadedFiles: 0
  totalOrdersProcessed: 0
  totalVCsCreated: 0
}

export async function getTotalUsersFirebase(): Promise<AppStat> {
  const usersCollection = collection(firestore, 'users')
  const userSnapshot = await getDocs(usersCollection)
  let totalUploadedFiles = 0
  let totalOrdersProcessed = 0
  let totalVCsCreated = 0
  userSnapshot.forEach((doc) => {
    const data = doc.data() as UserData
    totalUploadedFiles += data.filesUploaded || 0
    totalOrdersProcessed += data.totalOrdersProcessed || 0
    totalVCsCreated += data.totalVCs || 0
  })
  return {
    totalUsers: userSnapshot.size,
    totalUploadedFiles,
    totalOrdersProcessed,
    totalVCsCreated
  } as AppStat
}
