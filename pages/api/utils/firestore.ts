import { initiateAdmin } from './firebase'
import { getFirestore } from 'firebase-admin/firestore'

export const createDb = async () => {
  const admin = await initiateAdmin()
  return getFirestore(admin!)
}
