import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { PrimaryButton } from '../../common/Button'
import { handleError } from '@/utils/handleError'
import styles from './styles.module.css'

export const ImportQuestionTopicsButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('csv', file)

    try {
      const response = await fetch('/api/questions/topics/import', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to import question topics')
      }

      const data = await response.json() as { questionsCount: number, importErrors: string[] }
      toast.success(`Question topics imported successfully!`)
      if (data.importErrors) {
        for (const error of data.importErrors) {
          toast.error(error, {
            autoClose: false
          })
        }
      }
    } catch (error) {
      handleError(error, 'Something went wrong while importing question topics.')
    }

    setIsLoading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className={styles.hiddenInput}
      />
      <PrimaryButton 
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? 'Importing...' : 'Import Topics for Existing Questions'}
      </PrimaryButton>
    </>
  )
} 
