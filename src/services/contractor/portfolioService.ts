import axios from 'axios'
import { axiosClient } from '../auth/axiosClient'
import type { ApiResponse } from '../../types/contractor/contractorProfileTypes'
import type { Portfolio, CreatePortfolioRequest } from '../../types/contractor/portfolioTypes'

function getErrorMessage(error: unknown, fallback: string) {
	if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
		return error.response?.data?.message ?? fallback
	}
	return fallback
}

export const portfolioService = {
	async getMyPortfolio(): Promise<Portfolio[]> {
		try {
			const response = await axiosClient.get<ApiResponse<Portfolio[]>>('/api/portfolio')
			return response.data.data
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Unable to load portfolio items'), { cause: error })
		}
	},

	async addPortfolio(payload: CreatePortfolioRequest): Promise<Portfolio> {
		try {
			const response = await axiosClient.post<ApiResponse<Portfolio>>('/api/portfolio', payload)
			return response.data.data
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Unable to add portfolio item'), { cause: error })
		}
	},

	async deletePortfolio(id: number): Promise<void> {
		try {
			await axiosClient.delete<ApiResponse<void>>(`/api/portfolio/${id}`)
		} catch (error) {
			throw new Error(getErrorMessage(error, 'Unable to delete portfolio item'), { cause: error })
		}
	},
}
