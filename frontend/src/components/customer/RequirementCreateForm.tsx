import type { ChangeEvent, FormEvent } from 'react'
import type { CreateRequirementRequest } from '../../types/customer/RequirementTypes'

interface RequirementCreateFormProps {
  formValues: CreateRequirementRequest
  saving: boolean
  validationError: string | null
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const fieldClass =
  'mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

const PROPERTY_TYPE_OPTIONS = [
  { value: '', label: 'Select Property Type / Service' },
  { value: 'Residential House / Villa', label: 'Residential House / Villa' },
  { value: 'Apartment / Flat', label: 'Apartment / Flat' },
  { value: 'Commercial Building', label: 'Commercial Building' },
  { value: 'Office Space', label: 'Office Space' },
  { value: 'Renovation / Extension', label: 'Renovation / Extension' },
  { value: 'Interior Design & Fitout', label: 'Interior Design & Fitout' },
  { value: 'Plot Development', label: 'Plot Development' },
  { value: 'Other', label: 'Other' },
]

export function RequirementCreateForm({
  formValues,
  saving,
  validationError,
  onChange,
  onSubmit,
}: RequirementCreateFormProps) {
  // Get today's date formatted as YYYY-MM-DD to restrict past dates
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <label className="flex flex-col text-sm font-medium text-stone-700 md:col-span-2">
          <span>Project Title <span className="text-red-500">*</span></span>
          <input
            className={fieldClass}
            name="title"
            value={formValues.title}
            onChange={onChange}
            required
            maxLength={150}
            placeholder="e.g., 3BHK Villa Construction or Kitchen Renovation"
          />
        </label>

        {/* Property Type / Service Category */}
        <label className="flex flex-col text-sm font-medium text-stone-700">
          <span>Property Type / Category <span className="text-red-500">*</span></span>
          <select
            className={fieldClass}
            name="serviceCategory"
            value={formValues.serviceCategory}
            onChange={onChange}
            required
          >
            {PROPERTY_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {/* Location */}
        <label className="flex flex-col text-sm font-medium text-stone-700">
          <span>Location <span className="text-red-500">*</span></span>
          <input
            className={fieldClass}
            name="location"
            value={formValues.location}
            onChange={onChange}
            required
            maxLength={255}
            placeholder="e.g., Indiranagar, Bengaluru"
          />
        </label>

        {/* Description */}
        <label className="flex flex-col text-sm font-medium text-stone-700 md:col-span-2">
          <span>Detailed Description <span className="text-red-500">*</span></span>
          <textarea
            className={`${fieldClass} min-h-32 resize-y`}
            name="description"
            value={formValues.description}
            onChange={onChange}
            required
            maxLength={2000}
            placeholder="Describe your requirement details, dimensions, preferred materials, style preferences, etc."
          />
        </label>

        {/* Budget Min */}
        <label className="flex flex-col text-sm font-medium text-stone-700">
          <span>Minimum Budget (₹) <span className="text-red-500">*</span></span>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500 text-sm">₹</span>
            <input
              type="number"
              className={`${fieldClass} mt-0 pl-7`}
              name="budgetMin"
              value={formValues.budgetMin || ''}
              onChange={onChange}
              required
              min={1}
              placeholder="e.g., 500000"
            />
          </div>
        </label>

        {/* Budget Max */}
        <label className="flex flex-col text-sm font-medium text-stone-700">
          <span>Maximum Budget (₹) <span className="text-red-500">*</span></span>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500 text-sm">₹</span>
            <input
              type="number"
              className={`${fieldClass} mt-0 pl-7`}
              name="budgetMax"
              value={formValues.budgetMax || ''}
              onChange={onChange}
              required
              min={1}
              placeholder="e.g., 1000000"
            />
          </div>
        </label>

        {/* Expected Start Date */}
        <label className="flex flex-col text-sm font-medium text-stone-700">
          <span>Expected Start Date</span>
          <input
            type="date"
            className={fieldClass}
            name="preferredStartDate"
            value={formValues.preferredStartDate || ''}
            onChange={onChange}
            min={todayStr}
          />
        </label>
      </div>

      {validationError && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {validationError}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {saving ? 'Submitting...' : 'Post Requirement'}
        </button>
      </div>
    </form>
  )
}
