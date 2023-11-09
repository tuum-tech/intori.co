import {
  OrderData,
  UploadedDataDetail
} from '@/components/upload/UploadedTypes'
import { AgeOfOrder, ProductValueRange } from '@/lib/firebase/functions/getVCs'
import { IssuerType } from '@veramo/core'
import { createHash } from 'crypto'
import { calculateVCUSDValue } from './credValue'

export type Review = {
  author: string
  rating: number
  reviewText: string
}

export type Offer = {
  seller: string
  price: number
  shippingCost: number
}

export type ProductInfo = {
  productName: string
  productDescription: string
  category: string
  brandName: string
  modelNumber: string
  EAN: string
  UPC: string
  price: number
  imageURL: string
  ratings: number
  numberOfReviews: number
  salesRank: number
  technicalDetails: Record<string, string>
  reviews: Review[]
  offers: Offer[]
  GTIN: string
  keyword: string
}

export function generateUniqueId(orderData: OrderData): string {
  // Convert the order object to a string
  const orderString = JSON.stringify(orderData)

  // Hash the string using SHA-256 and return as hex
  return createHash('sha256').update(orderString).digest('hex')
}

// TODO: Implement this function
export async function getProductInfoFromASIN(
  _asin: string
): Promise<ProductInfo> {
  return {} as ProductInfo
}

export async function normalizeOrderData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any
): Promise<UploadedDataDetail> {
  const productInfo: ProductInfo = await getProductInfoFromASIN(row['ASIN'])
  const orderData = {
    name: row['Product Name'] ?? '',
    asin: row['ASIN'] ?? '',
    description: productInfo.productDescription ?? '',
    category: productInfo.category ?? '',
    brandName: productInfo.brandName ?? '',
    imageURL: productInfo.imageURL ?? '',
    ratings: productInfo.ratings ?? 0,
    store: row['Website'] ?? '',
    purchasedDate: row['Order Date'] ?? '',
    amount: `${row['Total Owed'] ?? 0} ${row['Currency'] ?? 'USD'}`
  } as OrderData

  // Create a unique ID
  const uniqueId = generateUniqueId(orderData)

  // Now, we can add the uploadedDate
  orderData.uploadedDate = new Date().toISOString()

  // Calculate the produce price range
  orderData.productValueRange = ProductValueRange.Invalid
  if (row['Currency'] === 'USD') {
    orderData.productValueRange = isNaN(row['Total Owed'])
      ? ProductValueRange.Invalid
      : row['Total Owed'] > 100
      ? ProductValueRange.GreaterThanHundred
      : row['Total Owed'] > 50
      ? ProductValueRange.BetweenFiftyAndHundred
      : ProductValueRange.LessThanFifty
  }
  const ageInMonths = calculateAgeInMonths(row['Order Date'])
  orderData.ageOfOrder =
    ageInMonths === -1
      ? AgeOfOrder.Invalid
      : ageInMonths > 12
      ? AgeOfOrder.GreaterThanOneYear
      : ageInMonths > 6
      ? AgeOfOrder.BetweenSixAndTwelveMonths
      : AgeOfOrder.LessThanSixMonths

  orderData.worth = calculateVCUSDValue(
    orderData.ageOfOrder,
    orderData.productValueRange
  )
  return {
    id: uniqueId,
    orderData
  } as UploadedDataDetail
}

export function calculateAgeInMonths(orderDate: string): number {
  const startDate = new Date(orderDate)
  // We need to handle an invalid date string just in case
  if (isNaN(startDate.getTime())) {
    return -1
  }
  const endDate = new Date()

  let months
  months = (endDate.getFullYear() - startDate.getFullYear()) * 12
  months -= startDate.getMonth() + 1
  months += endDate.getMonth()

  return months <= 0 ? 0 : months
}

export function ensureStringArray(
  value: string | string[] | undefined
): string[] {
  // If the value is undefined, return an empty array
  if (value === undefined) {
    return []
  }

  // If the value is a string, return an array containing just the string
  if (typeof value === 'string') {
    return [value]
  }

  // Otherwise, the value must already be a string array, so return it as-is
  return value
}

export function ensureString(
  value: string | undefined,
  defaultValue: string = ''
): string {
  return value !== undefined ? value : defaultValue
}

export function getIdFromIssuer(issuer: IssuerType): string {
  // Check if 'issuer' is an object and has an 'id' property
  if (typeof issuer === 'object' && 'id' in issuer) {
    return issuer.id
  } else if (typeof issuer === 'string') {
    return issuer
  }
  return ''
}
