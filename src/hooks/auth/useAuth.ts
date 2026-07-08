import { useAuthSelector } from './useAuthStore'

export function useAuth() {
  return useAuthSelector((state) => state.auth)
}
