import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode
} from 'react';
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import { CategoryType } from '@/models/categories';
import { createCategory, deleteCategory, getAllCategories } from '@/requests/categories'
import { AddNewCategoryModal } from '@/components/Categories/AddNewCategoryModal'

interface CategoriesContextType {
  allCategories: CategoryType[]
  addCategory: (category: string) => Promise<void>
  removeCategory: (categoryId: string) => Promise<void>
  showAddCategoryModal: () => void
}

const CategoriesContext = createContext<CategoriesContextType>({
  allCategories: [],
  addCategory: async () => {},
  removeCategory: async () => {},
  showAddCategoryModal: () => {}
})

// Create a provider component
export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [allCategories, setAllCategories] = useState<CategoryType[]>([])
  const [addingNewCategory, setAddingNewCategory] = useState(false)

  const fetchAllCategories = useCallback(async () => {
    try {
      const res = await getAllCategories()
      console.log('total categories:', res.data.length)
      setAllCategories(res.data)
    } catch (err) {
      toast.error('Failed to load categories. Please try again later.')
      setAllCategories([])
    }
  }, [])

  useEffect(() => {
    fetchAllCategories()
  }, [fetchAllCategories])

  const addCategory = async (category: string) => {
    try {
      const res = await createCategory({ category })
      setAllCategories([...allCategories, res.data])
      toast.success('New category added.')
    } catch (err) {
      const errorMessage = isAxiosError(err) ? err?.response?.data?.error : 'Failed to add new category. Please try again later.'
      toast.error(errorMessage)
    }
  }

  const removeCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      setAllCategories(allCategories.filter(c => c.id !== categoryId))
      toast.success('Category removed.')
    } catch (err) {
      toast.error('Failed to remove category. Please try again later.')
    }
  }

  const showAddCategoryModal = () => {
    setAddingNewCategory(true)
  }

  return (
    <CategoriesContext.Provider
      value={{
        allCategories,
        addCategory,
        removeCategory,
        showAddCategoryModal
      }}
    >
      <>
        <AddNewCategoryModal show={addingNewCategory} onClose={() => setAddingNewCategory(false)} />
        {children}
      </>
    </CategoriesContext.Provider>
  )
}

// Create a custom hook to consume the context
export const useCategories = () => {
  const context = useContext(CategoriesContext)

  if (!context) {
    throw new Error('useCounter must be used')
  }

  return context
}
