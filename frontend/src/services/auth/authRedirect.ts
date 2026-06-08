import type { UserRole } from '../../types/auth/authTypes'

const roleRedirects: Record<string, string> = {
  ROLE_CUSTOMER: '/customer/dashboard',
  ROLE_CONTRACTOR: '/contractor/dashboard',
  ROLE_WORKER: '/worker/dashboard',
  ROLE_ARCHITECT: '/architect/dashboard',
  ROLE_ADMIN: '/admin/dashboard',
}

export function getDashboardPathForRole(role: UserRole | undefined) {
  if (!role) {
    return '/customer/dashboard'
  }

  return roleRedirects[role] ?? '/customer/dashboard'
}
