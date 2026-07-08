import { useEffect, useState } from 'react'
import { ContractorPageShell } from '../../components/contractor/ContractorPageShell'
import { useContractorDispatch, useContractorSelector } from '../../hooks/contractor/useContractorStore'
import { fetchOpenLeads, clearLeadError } from '../../store/contractor/leadSlice'
import type { Lead } from '../../types/contractor/leadTypes'

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

export function LeadsListPage() {
  const dispatch = useContractorDispatch()
  const { items, loading, error } = useContractorSelector((state) => state.lead)

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [locationSearch, setLocationSearch] = useState('')

  // Modal states
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    void dispatch(fetchOpenLeads())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearLeadError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  // Get unique categories for dropdown filter
  const categories = Array.from(
    new Set(items.map((lead) => lead.serviceCategory).filter(Boolean))
  )

  // Filter items
  const filteredLeads = items.filter((lead) => {
    const matchesSearch =
      lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory
      ? lead.serviceCategory === selectedCategory
      : true
    const matchesLocation = lead.location
      .toLowerCase()
      .includes(locationSearch.toLowerCase())
    return matchesSearch && matchesCategory && matchesLocation
  })

  return (
    <ContractorPageShell>
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase text-amber-700">Discovery Engine</p>
          <h1 className="text-3xl font-bold text-stone-950">Lead Discovery</h1>
          <p className="max-w-2xl text-sm text-stone-600">
            Browse and find open requirements that match your expertise. View requirements, check budget allocations, and follow up.
          </p>
        </section>

        {/* Error Notification */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 animate-pulse">
            {error}
          </div>
        )}

        {/* Filters Panel */}
        <section className="grid gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-3">
          <div>
            <label htmlFor="search" className="block text-xs font-semibold text-stone-700 uppercase">
              Search Keywords
            </label>
            <input
              id="search"
              type="text"
              placeholder="e.g. Painting, Modular kitchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-stone-700 uppercase">
              Service Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-xs font-semibold text-stone-700 uppercase">
              Location Filter
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g. Hyderabad, Springfield..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 shadow-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </section>

        {/* Loading Indicator */}
        {loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-700 border-t-transparent" />
            <p className="mt-4 text-sm text-stone-600">Retrieving new leads...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredLeads.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-stone-950">No Open Leads Found</h3>
            <p className="mt-2 max-w-sm text-sm text-stone-600">
              {items.length === 0
                ? "There are currently no active client requirements in the database. Please check back later."
                : "No leads matched your search criteria. Try modifying your search keywords or removing filters."}
            </p>
          </div>
        )}

        {/* Leads Grid */}
        {!loading && filteredLeads.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <article
                key={lead.id}
                className="group flex flex-col justify-between overflow-hidden rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
              >
                <div>
                  {/* Category Tag */}
                  <span className="inline-flex rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    {lead.serviceCategory}
                  </span>

                  {/* Title & Date */}
                  <h3 className="mt-3 text-lg font-bold text-stone-950 line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {lead.title}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500">
                    Posted on {formatDate(lead.createdAt)}
                  </p>

                  {/* Location Info */}
                  <div className="mt-4 flex items-center gap-1.5 text-sm text-stone-600">
                    <svg className="h-4.5 w-4.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <span className="line-clamp-1">{lead.location}</span>
                  </div>

                  {/* Budget Allocation */}
                  <div className="mt-4 rounded-md bg-stone-50 p-3">
                    <p className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">
                      Budget Range
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-stone-950">
                      {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
                    </p>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-5 border-t border-stone-100 pt-4">
                  <button
                    onClick={() => setSelectedLead(lead)}
                    className="inline-flex w-full items-center justify-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-stone-950 focus:outline-none"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-stone-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {selectedLead.serviceCategory}
                </span>
                <h2 className="mt-2 text-xl font-bold text-stone-950">
                  {selectedLead.title}
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                  Posted on {formatDate(selectedLead.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase text-stone-500">Project Description</h4>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                  {selectedLead.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-stone-500">Estimated Budget</h4>
                  <p className="mt-1 text-sm font-semibold text-stone-950">
                    {formatCurrency(selectedLead.budgetMin)} - {formatCurrency(selectedLead.budgetMax)}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-stone-500">Preferred Start</h4>
                  <p className="mt-1 text-sm font-semibold text-stone-950">
                    {selectedLead.preferredStartDate
                      ? formatDate(selectedLead.preferredStartDate)
                      : 'Flexible / Not Specified'}
                  </p>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4">
                <h4 className="text-xs font-semibold uppercase text-stone-500">Location</h4>
                <p className="mt-1 text-sm text-stone-950 flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  {selectedLead.location}
                </p>
              </div>

              {/* Privacy/Action Disclaimer Banner */}
              <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3.5 text-xs text-amber-900 leading-relaxed">
                <span className="font-semibold">Privacy Protection:</span> Customer contact details (such as email and phone number) are hidden. You will be able to contact the customer and exchange contact details once a mutual service connection is formed.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </ContractorPageShell>
  )
}
