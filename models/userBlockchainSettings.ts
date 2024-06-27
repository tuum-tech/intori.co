import { createDb } from '../pages/api/utils/firestore'

export type UserBlockchainSettingsType = {
  fid: number
  autoPublish: boolean // default: false
}

let userBlockchainSettingsCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (userBlockchainSettingsCollection) {
    return userBlockchainSettingsCollection
  }

  const db = createDb()
  return db.collection('userBlockchainSettings')
}

const createUserBlockchainSettings = async (fid: number): Promise<UserBlockchainSettingsType> => {
  const collection = getCollection()

  const doc = await collection.add({
    fid,
    autoPublish: false
  })

  const ref = await doc.get()

  return ref.data() as UserBlockchainSettingsType
}

export const getBlockchainSettingsForUser = async (
  fid: number
): Promise<UserBlockchainSettingsType> => {
  const collection = getCollection()

  const doc = await collection.where('fid', '==', fid).get()

  if (doc.size === 0) {
    return createUserBlockchainSettings(fid)
  }

  return doc.docs[0].data() as UserBlockchainSettingsType
}

export const updateBlockchainSettingsForUser = async (
  fid: number,
  body: { autoPublish: boolean }
): Promise<UserBlockchainSettingsType> => {
  const collection = getCollection()

  const doc = await collection.where('fid', '==', fid).get()

  if (doc.size === 0) {
    return createUserBlockchainSettings(fid)
  }

  const ref = doc.docs[0].ref

  await ref.update(body)

  return {
    fid,
    ...body
  }
}
