import axios, { AxiosError } from 'axios'
import { axiosClient } from '../auth/axiosClient'
import type {
  ApiResponse,
  ContractorProfile,
  ContractorProfileRequest,
} from '../../types/contractor/contractorProfileTypes'

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}

export const contractorProfileService = {
  async loadProfile() {
    try {
      const response = await axiosClient.get<ApiResponse<ContractorProfile>>('/api/contractor/profile')
      return response.data.data
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>
      if (axiosError.response?.status === 404) {
        return null
      }
      throw new Error(getErrorMessage(error, 'Unable to load contractor profile'), { cause: error })
    }
  },

  async createProfile(payload: ContractorProfileRequest) {
    try {
      const response = await axiosClient.post<ApiResponse<ContractorProfile>>(
        '/api/contractor/profile',
        payload,
      )
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to create contractor profile'), { cause: error })
    }
  },

  async updateProfile(payload: ContractorProfileRequest) {
    try {
      const response = await axiosClient.put<ApiResponse<ContractorProfile>>(
        '/api/contractor/profile',
        payload,
      )
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to update contractor profile'), { cause: error })
    }
  },
}
