import { IssuerType } from '@veramo/core'
import { createHash } from 'crypto'

export function generateUniqueId(object: any): string {
  // Convert the order object to a string
  const orderString = JSON.stringify(object)

  // Hash the string using SHA-256 and return as hex
  return createHash('sha256').update(orderString).digest('hex')
}

export function getProductDescription(asin: string) {
  // This is a mock function. In a real-world scenario, you'd use an API to fetch this data.
  return 'Sample description for ASIN: ' + asin
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
