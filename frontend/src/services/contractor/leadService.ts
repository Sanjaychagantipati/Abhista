import axios from 'axios'
import { axiosClient } from '../auth/axiosClient'
import type { ApiResponse } from '../../types/contractor/contractorProfileTypes'
import type { Lead } from '../../types/contractor/leadTypes'

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? fallback
  }
  return fallback
}

export const leadService = {
  async getOpenLeads(): Promise<Lead[]> {
    try {
      const response = await axiosClient.get<ApiResponse<Lead[]>>('/api/leads')
      return response.data.data
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to load open leads'), { cause: error })
    }
  },
}
