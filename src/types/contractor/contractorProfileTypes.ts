export interface ContractorProfile {
  id: number
  userId: number
  companyName: string
  ownerName: string
  phoneNumber: string
  experienceYears: number
  specialization: string
  serviceAreas: string | null
  description: string | null
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  createdAt: string
  updatedAt: string | null
}

export interface ContractorProfileRequest {
  companyName: string
  ownerName: string
  phoneNumber: string
  experienceYears: number
  specialization: string
  serviceAreas: string
  description: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ContractorProfileState {
  profile: ContractorProfile | null
  loading: boolean
  saving: boolean
  error: string | null
  successMessage: string | null
  loaded: boolean
}
