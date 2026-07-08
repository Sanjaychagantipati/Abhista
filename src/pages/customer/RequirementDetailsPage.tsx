import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CustomerPageShell } from '../../components/customer/CustomerPageShell'
import { useCustomerDispatch, useCustomerSelector } from '../../hooks/customer/useCustomerStore'
import {
  clearCurrentRequirement,
  loadRequirementById,
} from '../../store/customer/customerRequirementSlice'
import type { RequirementStatus } from '../../types/customer/RequirementTypes'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Not specified'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
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

export function RequirementDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useCustomerDispatch()
  const { currentRequirement: req, loading, error } = useCustomerSelector(
    (state) => state.customerRequirement,
  )

  useEffect(() => {
    if (id) {
      void dispatch(loadRequirementById(Number(id)))
    }

    return () => {
      dispatch(clearCurrentRequirement())
    }
  }, [dispatch, id])

  return (
    <CustomerPageShell>
      <div className="grid gap-6">
        {/* Header Navigation */}
        <div className="flex items-center">
          <Link
            to="/customer/requirements"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Requirements
          </Link>
        </div>

        {error && (
          <div
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {loading && !req ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-emerald-600" />
              <p className="text-sm text-stone-600">Loading requirement details...</p>
            </div>
          </div>
        ) : req ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Details */}
            <div className="grid gap-6 lg:col-span-2">
              {/* Main Card */}
              <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-100 pb-5">
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${getStatusBadgeClass(
                        req.status,
                      )}`}
                    >
                      {formatStatusText(req.status)}
                    </span>
                    <h1 className="mt-3 text-2xl font-bold text-stone-950 sm:text-3xl">
                      {req.title}
                    </h1>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
                      <svg
                        className="h-4 w-4 text-stone-400"
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {req.location}
                    </p>
                  </div>
                </div>

                <div className="pt-5">
                  <h2 className="text-base font-semibold text-stone-900">Description</h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                    {req.description}
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar Summary */}
            <div className="grid gap-6 lg:col-span-1">
              <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm self-start">
                <h2 className="text-lg font-bold text-stone-950 border-b border-stone-100 pb-3">
                  Requirement Summary
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                  {/* Category */}
                  <div>
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Property Type / Category
                    </span>
                    <p className="mt-1 text-sm font-semibold text-stone-900">{req.serviceCategory}</p>
                  </div>

                  {/* Budget */}
                  <div>
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Budget Range
                    </span>
                    <p className="mt-1 text-sm font-semibold text-emerald-800">
                      {formatCurrency(req.budgetMin)} - {formatCurrency(req.budgetMax)}
                    </p>
                  </div>

                  {/* Expected Start Date */}
                  <div>
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Expected Start Date
                    </span>
                    <p className="mt-1 text-sm font-semibold text-stone-900">
                      {formatDate(req.preferredStartDate)}
                    </p>
                  </div>

                  {/* Posted Date */}
                  <div>
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      Posted On
                    </span>
                    <p className="mt-1 text-sm font-semibold text-stone-900">
                      {formatDate(req.createdAt)}
                    </p>
                  </div>

                  {/* Last Updated */}
                  {req.updatedAt && (
                    <div>
                      <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Last Updated
                      </span>
                      <p className="mt-1 text-sm font-semibold text-stone-900">
                        {formatDate(req.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </div>
    </CustomerPageShell>
  )
}
