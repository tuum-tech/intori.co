import {
  OrderData,
  UploadedDataDetail
} from '@/components/upload/UploadedTypes'
import { AgeOfOrder, ProductValueRange } from '@/lib/firebase/functions/getVCs'
import { IssuerType } from '@veramo/core'
import axios from 'axios'
import cheerio from 'cheerio'
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

export async function getProductInfoFromASIN(
  asin: string
): Promise<ProductInfo> {
  const productInfo = {} as ProductInfo
  try {
    const response = await axios.get(`https://www.amazon.com/dp/${asin}`)
    const html = response.data
    const $ = cheerio.load(html)

    productInfo.productName = $('.product-title').text()
    productInfo.productDescription = $('.product-description').text()
    productInfo.category = $(
      '.productDetails_detailBullets_sections li.a-list-item span.a-size-small.a-color-secondary'
    ).text()
    productInfo.brandName = $('.brand-name').text()
    productInfo.modelNumber = $('.model-number').text()
    productInfo.EAN = $('.EAN').text()
    productInfo.UPC = $('.UPC').text()
    productInfo.price = Number(
      $('.price')
        .text()
        .replace(/[^\d.]/g, '')
    )
    productInfo.imageURL = $('.product-image').attr('src') || ''
    productInfo.ratings = Number(
      $('.ratings')
        .text()
        .replace(/[^\d.]/g, '')
    )
    productInfo.numberOfReviews = Number(
      $('.review-count')
        .text()
        .replace(/[^\d.]/g, '')
    )
    productInfo.salesRank = Number(
      $('.sales-rank')
        .text()
        .replace(/[^\d.]/g, '')
    )

    productInfo.technicalDetails = {} as Record<string, string>
    $('.technical-details')
      .find('th')
      .each((i, element) => {
        const key = $(element).text()
        const value = $(element).next('td').text()
        productInfo.technicalDetails[key] = value
      })

    productInfo.reviews = [] as Review[]
    $('.review').each((i, element) => {
      const author = $(element).find('.author').text()
      const rating = Number(
        $(element)
          .find('.rating')
          .text()
          .replace(/[^\d.]/g, '')
      )
      const reviewText = $(element).find('.review-text').text()

      productInfo.reviews.push({
        author,
        rating,
        reviewText
      })
    })

    productInfo.offers = [] as Offer[]
    $('.offer').each((i, element) => {
      const seller = $(element).find('.seller').text()
      const price = Number(
        $(element)
          .find('.price')
          .text()
          .replace(/[^\d.]/g, '')
      )
      const shippingCost = Number(
        $(element)
          .find('.shipping-cost')
          .text()
          .replace(/[^\d.]/g, '')
      )

      productInfo.offers.push({
        seller,
        price,
        shippingCost
      })
    })

    productInfo.GTIN = $('.GTIN').text()
    productInfo.keyword = $('.keyword').text()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code outside of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
  }
  return productInfo
}

export async function normalizeOrderData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any
): Promise<UploadedDataDetail> {
  const productInfo: ProductInfo = await getProductInfoFromASIN(row['ASIN'])
  const orderData = {
    name: row['Product Name'] || '',
    asin: row['ASIN'] || '',
    description: productInfo.productDescription || '',
    category: productInfo.category || '',
    brandName: productInfo.brandName || '',
    imageURL: productInfo.imageURL || '',
    ratings: productInfo.ratings || 0,
    store: row['Website'] || '',
    purchasedDate: row['Order Date'] || '',
    amount: `${row['Total Owed'] || 0} ${row['Currency'] || 'USD'}`
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
