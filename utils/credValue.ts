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
