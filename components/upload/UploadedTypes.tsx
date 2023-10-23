export type OrderData = {
  name: string
  description: string
  store: string
  purchasedDate: string
  uploadedDate: string
  amount: string
}

export type UploadedDataDetail = {
  id: string
  orderData: OrderData
}
