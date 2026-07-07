export interface Portfolio {
	id: number
	contractorId: number
	title: string
	description: string
	projectType: string
	imageUrl: string | null
	createdAt: string
	updatedAt: string | null
}

export interface CreatePortfolioRequest {
	title: string
	description: string
	projectType: string
	imageUrl?: string
}

export interface PortfolioState {
	items: Portfolio[]
	loading: boolean
	saving: boolean
	error: string | null
	successMessage: string | null
}
