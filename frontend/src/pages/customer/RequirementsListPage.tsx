import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CustomerPageShell } from '../../components/customer/CustomerPageShell'
import { useCustomerDispatch, useCustomerSelector } from '../../hooks/customer/useCustomerStore'
import { loadMyRequirements } from '../../store/customer/customerRequirementSlice'
import type { RequirementStatus } from '../../types/customer/RequirementTypes'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function getStatusBadgeClass(status: RequirementStatus) {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'UNDER_REVIEW':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'ACCEPTED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'PROJECT_CREATED':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'REJECTED':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-stone-50 text-stone-700 border-stone-200'
  }
}

function formatStatusText(status: RequirementStatus) {
  return status.replace(/_/g, ' ')
}

export function RequirementsListPage() {
  const dispatch = useCustomerDispatch()
  const { requirements, loading, error } = useCustomerSelector(
    (state) => state.customerRequirement,
  )

  useEffect(() => {
    void dispatch(loadMyRequirements())
  }, [dispatch])

  return (
    <CustomerPageShell>
      <div className="grid gap-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-emerald-700">Manage Requirements</p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-950">My Requirements</h1>
            <p className="mt-1 text-sm text-stone-600">
              Track the status of your posted construction and home service requirements.
            </p>
          </div>
          <Link
            to="/customer/requirements/create"
            className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Post a Requirement
          </Link>
        </section>

        {error && (
          <div
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading && requirements.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-emerald-600" />
              <p className="text-sm text-stone-600">Loading requirements...</p>
            </div>
          </div>
        ) : requirements.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="mt-4 text-base font-semibold text-stone-950">No Requirements Posted</h3>
            <p className="mt-2 text-sm text-stone-600 max-w-sm mx-auto">
              You haven't posted any requirements yet. Create a new requirement to connect with verified service professionals.
            </p>
            <div className="mt-6">
              <Link
                to="/customer/requirements/create"
                className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Post Your First Requirement
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="min-w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200" aria-label="Requirements listing">
                <thead className="bg-stone-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500"
                    >
                      Budget Range
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-stone-500"
                    >
                      Created Date
                    </th>
                    <th scope="col" className="relative px-6 py-3.5">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {requirements.map((req) => (
                    <tr key={req.id} className="hover:bg-stone-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-semibold text-stone-950">{req.title}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{req.serviceCategory} • {req.location}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-900">
                        {formatCurrency(req.budgetMin)} - {formatCurrency(req.budgetMax)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${getStatusBadgeClass(
                            req.status,
                          )}`}
                        >
                          {formatStatusText(req.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-stone-600">
                        {formatDate(req.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Link
                          to={`/customer/requirements/${req.id}`}
                          className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CustomerPageShell>
  )
}
