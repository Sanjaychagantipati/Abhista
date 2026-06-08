import type { ChangeEvent, FormEvent } from 'react'
import type { LoginRequest } from '../../types/auth/authTypes'

interface LoginFormProps {
  values: LoginRequest
  loading: boolean
  error: string | null
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const fieldClass =
  'mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

export function LoginForm({ values, loading, error, onChange, onSubmit }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <label className="text-sm font-medium text-stone-700">
        Email
        <input
          className={fieldClass}
          type="email"
          name="email"
          value={values.email}
          onChange={onChange}
          required
          autoComplete="email"
        />
      </label>

      <label className="text-sm font-medium text-stone-700">
        Password
        <input
          className={fieldClass}
          type="password"
          name="password"
          value={values.password}
          onChange={onChange}
          required
          autoComplete="current-password"
        />
      </label>

      {error && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
      >
        {loading ? 'Signing in...' : 'Login'}
      </button>
    </form>
  )
}
