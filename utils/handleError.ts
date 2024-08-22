import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'

export const handleError = (err: unknown, message: string) => {
  console.error(err)

  if (isAxiosError(err)) {
    toast.error(
      err.response?.data?.error ||
      message
    )
  } else {
    toast.error((err as Error).message ?? message)
  }
}
