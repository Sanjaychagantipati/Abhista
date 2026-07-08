export type RequirementStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'PROJECT_CREATED'
  | 'REJECTED'

export interface CreateRequirementRequest {
  title: string
  description: string
  serviceCategory: string
  location: string
  budgetMin: number
  budgetMax: number
  preferredStartDate?: string | null
}

export interface RequirementCreateResponse {
  id: number
  status: RequirementStatus
  message: string
}

export interface RequirementResponse {
  id: number
  customerId: number
  title: string
  description: string
  serviceCategory: string
  location: string
  budgetMin: number
  budgetMax: number
  preferredStartDate: string | null
  status: RequirementStatus
  createdAt: string
  updatedAt: string | null
}

export interface CustomerRequirementState {
  requirements: RequirementResponse[]
  currentRequirement: RequirementResponse | null
  loading: boolean
  saving: boolean
  error: string | null
  loaded: boolean
}
