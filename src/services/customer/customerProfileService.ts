import axios, { AxiosError } from 'axios'
import { axiosClient } from '../auth/axiosClient'
import type {
  ApiResponse,
  CustomerProfile,
  CustomerProfileRequest,
} from '../../types/customer/customerProfileTypes'

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? fallback
  }

  return fallback
}

export const customerProfileService = {
  async loadProfile() {
    try {
      const response = await axiosClient.get<ApiResponse<CustomerProfile>>('/api/customer/profile')
      return response.data.data
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<unknown>>

      if (axiosError.response?.status === 404) {
        return null
      }

      throw new Error(getErrorMessage(error, 'Unable to load customer profile'), { cause: error })
    }
  },

  async createProfile(payload: CustomerProfileRequest) {
    try {
      const response = await axiosClient.post<ApiResponse<CustomerProfile>>(
        '/api/customer/profile',
        payload,
      )
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to create customer profile'), { cause: error })
    }
  },

  async updateProfile(payload: CustomerProfileRequest) {
    try {
      const response = await axiosClient.put<ApiResponse<CustomerProfile>>(
        '/api/customer/profile',
        payload,
      )
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to update customer profile'), { cause: error })
    }
  },
}
