import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../../../utils/firebase'

export type UserData = {
  loginCount: number
  uid: string
  walletAddress: string
  did: string
  email: string
  filesUploaded: number
  totalVCs: number
}

export type AppStat = {
  totalUsers: 0
  totalUploadedFiles: 0
  totalVCsCreated: 0
}

export async function getTotalUsers(): Promise<AppStat> {
  const usersCollection = collection(firestore, 'users')
  const userSnapshot = await getDocs(usersCollection)
  let totalUploadedFiles = 0
  let totalVCsCreated = 0
  userSnapshot.forEach((doc) => {
    const data = doc.data() as UserData
    totalUploadedFiles += data.filesUploaded
    totalVCsCreated += data.totalVCs
  })
  return {
    totalUsers: userSnapshot.size,
    totalUploadedFiles,
    totalVCsCreated
  } as AppStat
}
