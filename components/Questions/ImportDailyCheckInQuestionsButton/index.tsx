import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { PrimaryButton } from '../../common/Button'
import { handleError } from '@/utils/handleError'
import { useQueryClient } from '@tanstack/react-query'
import styles from './styles.module.css'

export const ImportDailyCheckInQuestionsButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('csv', file)

    try {
      const response = await fetch('/api/questions/import-daily-checkin', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to import daily check-in questions')
      }

      const data = await response.json() as { questionsCount: number, importErrors: string[] }
      toast.success(`${data.questionsCount} daily check-in questions imported successfully!`)
      if (data.importErrors) {
        for (const error of data.importErrors) {
          toast.error(error, {
            autoClose: false
          })
        }
      }

      // Invalidate the daily check-in questions query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['paginated-daily-checkin-questions'] })
    } catch (error) {
      handleError(error, 'Something went wrong while importing daily check-in questions.')
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
        {isLoading ? 'Importing...' : 'Import Daily Check-in Questions'}
      </PrimaryButton>
    </>
  )
}
