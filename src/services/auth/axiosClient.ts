import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8085'

export function getStoredAccessToken() {
  return localStorage.getItem('accessToken')
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
