import { VCMetadata } from '@/lib/firebase/functions/getVCs'
import { UploadedDataDetail } from '../upload/UploadedTypes'

export type VCData = {
  data: unknown
  metadata: VCMetadata
}

export type CredentialDetail = {
  uploadedDataDetail: UploadedDataDetail
  vCred: VCData
}
