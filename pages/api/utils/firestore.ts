import { firebaseAdmin } from './firebase'
import { getFirestore } from 'firebase-admin/firestore'

export const db = getFirestore(firebaseAdmin)
