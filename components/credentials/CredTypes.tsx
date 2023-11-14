import { VCMetadata } from '@/lib/firebase/functions/getVCs'
import { VerifiableCredential } from '@veramo/core'
import { UploadedDataDetail } from '../upload/UploadedTypes'

export type VCData = {
  data: VerifiableCredential
  metadata: VCMetadata
}

export type CredentialDetail = {
  uploadedDataDetail: UploadedDataDetail
  vCred: VCData
}
