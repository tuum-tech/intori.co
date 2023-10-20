export type VerifiableCredential = {
  name: string
  description: string
  category: string
  store: string
  orderDate: string
  amount: string
  vcType: string[]
  vcIssuedBy: string
  vcIssuedDate: string
  vcExpiryDate: string
}

export type CredentialDetail = {
  id: string
  verifiableCredential: VerifiableCredential
}
