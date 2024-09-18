import { createDb } from '../pages/api/utils/firestore'

export type CategoryType = {
  id: string
  category: string
}

let categoryCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const getCollection = () => {
  if (categoryCollection) {
    return categoryCollection
  }

  const db = createDb()
  return db.collection('categories')
}

export const getAllCategories = async (): Promise<CategoryType[]> => {
  const collection = getCollection()
  const snapshot = await collection.get()

  return snapshot.docs.map(doc => ({
    id: doc.id,
    category: doc.data().category
  }))
}

// TODO: Create Category

// TODO: Update Category

// TODO: Delete Category
