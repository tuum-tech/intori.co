import { createDb } from '../pages/api/utils/firestore'

export type CategoryType = {
  category: string
}

let categoryCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (categoryCollection) {
    return categoryCollection
  }

  const db = createDb()
  return db.collection('questionCategories')
}

export const syncCategories = async (categories: string[]) => {
  const batch = createDb().batch()
  const collection = getCollection()

  const existingCategoriesSnapshot = await collection.get()
  const existingCategories = new Set(
    existingCategoriesSnapshot.docs.map(doc => doc.data().category)
  )

  categories.forEach(category => {
    if (!existingCategories.has(category)) {
      const categoryRef = collection.doc(category)
      batch.set(categoryRef, { category })
    }
  })

  await batch.commit()
}

export const getAllCategories = async (): Promise<string[]> => {
  const collection = getCollection()
  const snapshot = await collection.get()
  return snapshot.docs.map(doc => (doc.data() as CategoryType).category)
}
