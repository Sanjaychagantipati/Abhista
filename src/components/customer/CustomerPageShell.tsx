import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LogoutButton } from '../auth/LogoutButton'

interface CustomerPageShellProps {
  children: ReactNode
}

export function CustomerPageShell({ children }: CustomerPageShellProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'px-3 py-2 text-sm font-medium transition',
      isActive
        ? 'border-b-2 border-emerald-600 text-emerald-800'
        : 'border-b-2 border-transparent text-stone-600 hover:text-stone-950',
    ].join(' ')

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link to="/" className="text-xl font-semibold text-stone-950">
            Abhista
          </Link>
          <nav className="flex items-center gap-2" aria-label="Customer navigation">
            <NavLink to="/" className={navLinkClass}>
              Marketplace
            </NavLink>
            <NavLink to="/customer/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/customer/requirements" className={navLinkClass}>
              Requirements
            </NavLink>
            <NavLink to="/customer/profile" className={navLinkClass}>
              Profile
            </NavLink>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
    </main>
  )
}
