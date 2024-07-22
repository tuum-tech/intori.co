import { toast } from 'react-toastify'

export const handleError = (err: unknown, message: string) => {
  console.error(err)
  toast.error((err as Error).message ?? message)
}
