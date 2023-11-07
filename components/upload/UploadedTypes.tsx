import { AgeOfOrder, ProductValueRange } from '@/lib/firebase/functions/getVCs'

export type OrderData = {
  name: string
  asin: string
  description: string
  category: string
  brandName: string
  imageURL: string
  ratings: number
  store: string
  purchasedDate: string
  uploadedDate: string
  amount: string
  productValueRange: ProductValueRange
  ageOfOrder: AgeOfOrder
  worth: number
}

export type UploadedDataDetail = {
  id: string
  orderData: OrderData
}
