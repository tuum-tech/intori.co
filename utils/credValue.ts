import { UploadedDataDetail } from '@/components/upload/UploadedTypes'
import { AgeOfOrder, ProductValueRange } from '@/lib/firebase/functions/getVCs'

export function calculateVCUSDValue(
  ageOfOrder: AgeOfOrder,
  productValueRange: ProductValueRange
) {
  let vcValue = 0
  if (ageOfOrder >= 0 && productValueRange >= 0) {
    if (productValueRange === 0) {
      vcValue = ageOfOrder > 1 ? 2 : ageOfOrder > 0 ? 2.5 : 3
    } else if (productValueRange === 1) {
      vcValue = ageOfOrder > 1 ? 2.5 : ageOfOrder > 0 ? 3 : 3.5
    } else if (productValueRange === 2) {
      vcValue = ageOfOrder > 1 ? 3 : ageOfOrder > 0 ? 4 : 5
    }
  }
  return vcValue
}

export function calculateTotalVCUSDValue(orderData: UploadedDataDetail[]) {
  return orderData.reduce((total, order) => {
    return total + (order.orderData.worth || 0)
  }, 0)
}

export function mapProductValueRangeToString(
  valueRange: ProductValueRange
): string {
  switch (valueRange) {
    case ProductValueRange.Invalid:
      return 'Order amount could not be determined'
    case ProductValueRange.LessThanFifty:
      return 'Order amount is between $0 and $50'
    case ProductValueRange.BetweenFiftyAndHundred:
      return 'Order amount is between $50 and $100'
    case ProductValueRange.GreaterThanHundred:
      return 'Order amount is greater than $100'
    default:
      return 'Invalid order amount'
  }
}

export function mapAgeOfOrderToString(ageRange: AgeOfOrder): string {
  switch (ageRange) {
    case AgeOfOrder.Invalid:
      return 'Age of order could not be determined'
    case AgeOfOrder.LessThanSixMonths:
      return 'Order was placed sometime in the last 6 months'
    case AgeOfOrder.BetweenSixAndTwelveMonths:
      return 'Order was placed sometime between the last 6 months and 1 year'
    case AgeOfOrder.GreaterThanOneYear:
      return 'Order was placed more than 1 year ago'
    default:
      return 'Invalid order amount'
  }
}
