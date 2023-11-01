import { VCMetadata } from '@/lib/firebase/functions/getVCs'
import { CreateVCResponseResult } from '@/lib/veramo/types/params'
import { UploadedDataDetail } from '../upload/UploadedTypes'

export type CredentialDetail = {
  uploadedDataDetail: UploadedDataDetail
  vCred: CreateVCResponseResult
  vCredMetadata: VCMetadata
}
