import { initiateAdmin } from './firebase'
import { getFirestore } from 'firebase-admin/firestore'

export const createDb = () => {
  const admin = initiateAdmin()
  const firestore =  getFirestore(admin!)
  firestore.settings({ ignoreUndefinedProperties: true })
  return firestore
}
