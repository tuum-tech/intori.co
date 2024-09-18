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

export const getCategoryById = async (categoryId: string): Promise<CategoryType> => {
  const collection = getCollection()
  const doc = await collection.doc(categoryId).get()

  return {
    id: doc.id,
    category: (doc.data() as CategoryType).category
  }
}

export const getCategoryByName = async (category: string): Promise<CategoryType> => {
  const collection = getCollection()
  const snapshot = await collection.where('category', '==', category).get()

  if (snapshot.empty) {
    throw new Error('Category not found')
  }
  
  const doc = snapshot.docs[0]
  return {
    id: doc.id,
    category: (doc.data() as CategoryType).category
  }
}

export const createCategory = async (category: string): Promise<CategoryType> => {
  const collection = getCollection()

  // check if category already exists
  const snapshot = await collection.where('category', '==', category).get()
  if (!snapshot.empty) {
    throw new Error('Category already exists')
  }

  const doc = await collection.add({ category })

  const ref = await doc.get()

  return {
    id: doc.id,
    category: (ref.data() as CategoryType).category
  }
}

export const deleteCategory = async (categoryId: string): Promise<void> => {
  const collection = getCollection()

  await collection.doc(categoryId).delete()
}
