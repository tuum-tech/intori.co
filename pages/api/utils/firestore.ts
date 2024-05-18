import { initiateAdmin } from './firebase'
import { getFirestore } from 'firebase-admin/firestore'

export const createDb = () => {
  const admin = initiateAdmin()
  return getFirestore(admin!)
}
