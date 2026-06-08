import axios from 'axios'
import { axiosClient } from './axiosClient'
import type { ApiResponse, LoginRequest, LoginResponse } from '../../types/auth/authTypes'

type LoginPayload = LoginResponse | ApiResponse<LoginResponse>

function unwrapLoginResponse(payload: LoginPayload): LoginResponse {
  if ('data' in payload && 'success' in payload) {
    return payload.data
  }

  return payload
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? fallback
  }

  return fallback
}

export const authService = {
  async login(request: LoginRequest) {
    try {
      const response = await axiosClient.post<LoginPayload>('/api/auth/login', request)
      return unwrapLoginResponse(response.data)
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Unable to login'), { cause: error })
    }
  },
}
