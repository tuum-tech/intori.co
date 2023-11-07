export type UserInfo = {
  did: string
  email: string
  wallet: {
    local: string
    magic: string
  }
  loginCount: number
  filesUploaded: number
  totalOrdersProcessed: number
  totalVCs: number
}
