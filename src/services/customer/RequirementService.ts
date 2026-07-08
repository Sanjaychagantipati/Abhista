import axios from 'axios'
import { axiosClient } from '../auth/axiosClient'
import type {
  CreateRequirementRequest,
  RequirementCreateResponse,
  RequirementResponse,
} from '../../types/customer/RequirementTypes'
import type { ApiResponse } from '../../types/customer/customerProfileTypes'

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? fallback
  }
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}

export const RequirementService = {
  async createRequirement(payload: CreateRequirementRequest): Promise<RequirementCreateResponse> {
    try {
      const response = await axiosClient.post<RequirementCreateResponse>(
        '/api/requirements',
        payload,
      )
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to create requirement'), { cause: error })
    }
  },

  async getMyRequirements(): Promise<RequirementResponse[]> {
    try {
      const response = await axiosClient.get<ApiResponse<RequirementResponse[]>>(
        '/api/requirements/my',
      )
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to load requirements'), { cause: error })
    }
  },

  async getRequirementById(id: number): Promise<RequirementResponse> {
    try {
      const response = await axiosClient.get<ApiResponse<RequirementResponse>>(
        `/api/requirements/${id}`,
      )
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to load requirement details'), { cause: error })
    }
  },
}
