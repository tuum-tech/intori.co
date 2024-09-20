import React, { useMemo } from 'react'
import { useCategories } from '@/contexts/useCategories'
import styles from './styles.module.css'

type Props = {
  categoryId: string
  onRemove: (categoryId: string) => void
}

export const OneCategoryTag: React.FC<Props> = ({
  categoryId,
  onRemove
}) => {
  const { allCategories } = useCategories()

  const categoryName = useMemo(() => {
    const category = allCategories.find((category) => category.id === categoryId)

    if (!category) {
      return 'Loading...'
    }

    return category.category
  }, [allCategories, categoryId])

  return (
    <div className={styles.category}>
      {categoryName}
        <button type="button" onClick={() => onRemove(categoryId)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>
        </button>
    </div>
  )
}

