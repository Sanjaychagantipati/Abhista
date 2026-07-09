import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '../../components/auth/LoginForm'
import { useAuthDispatch, useAuthSelector } from '../../hooks/auth/useAuthStore'
import { getDashboardPathForRole } from '../../services/auth/authRedirect'
import { loginThunk } from '../../store/auth/authSlice'
import type { LoginRequest } from '../../types/auth/authTypes'

const initialValues: LoginRequest = {
  email: '',
  password: '',
}

export function LoginPage() {
  const dispatch = useAuthDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, isAuthenticated, user } = useAuthSelector((state) => state.auth)
  const [values, setValues] = useState<LoginRequest>(initialValues)

  const queryParams = new URLSearchParams(location.search)
  const redirectParam = queryParams.get('redirect')

  useEffect(() => {
    if (isAuthenticated) {
      const target = redirectParam ? decodeURIComponent(redirectParam) : getDashboardPathForRole(user?.role)
      navigate(target, { replace: true })
    }
  }, [isAuthenticated, navigate, user?.role, redirectParam])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await dispatch(loginThunk(values))

    if (loginThunk.fulfilled.match(result)) {
      const redirectTo = getRedirectTarget(result.payload.user.role)
      navigate(redirectTo, { replace: true })
    }
  }

  function getRedirectTarget(role: string) {
    if (redirectParam) {
      return decodeURIComponent(redirectParam)
    }
    const from = location.state as { from?: { pathname?: string } } | null

    if (from?.from?.pathname && from.from.pathname !== '/login') {
      return from.from.pathname
    }

    return getDashboardPathForRole(role)
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-10 text-stone-950">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm lg:grid-cols-[1fr_420px]">
        <div className="flex min-h-[420px] flex-col justify-between bg-emerald-800 p-8 text-white">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-100">Abhista</p>
            <h1 className="mt-4 max-w-xl text-3xl font-semibold sm:text-4xl">
              Construction and home service coordination.
            </h1>
          </div>
          <p className="mt-8 max-w-lg text-sm text-emerald-50">
            Sign in to continue to your workspace.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-stone-950">Login</h2>
          <p className="mt-2 text-sm text-stone-600">Use your registered email and password.</p>
          <div className="mt-8">
            <LoginForm
              values={values}
              loading={loading}
              error={error}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
