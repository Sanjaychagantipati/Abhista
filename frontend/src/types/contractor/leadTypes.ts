export interface Lead {
  id: number
  title: string
  description: string
  serviceCategory: string
  location: string
  budgetMin: number
  budgetMax: number
  preferredStartDate: string | null
  createdAt: string
}

export interface LeadState {
  items: Lead[]
  loading: boolean
  error: string | null
}
