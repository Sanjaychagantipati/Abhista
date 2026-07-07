import type { ChangeEvent, FormEvent } from 'react'
import type { ContractorProfileRequest } from '../../types/contractor/contractorProfileTypes'

interface ContractorProfileFormProps {
  formValues: ContractorProfileRequest
  saving: boolean
  submitLabel: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const fieldClass =
  'mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-100'

export function ContractorProfileForm({
  formValues,
  saving,
  submitLabel,
  onChange,
  onSubmit,
}: ContractorProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium text-stone-700">
          Company Name
          <input
            className={fieldClass}
            name="companyName"
            value={formValues.companyName}
            onChange={onChange}
            required
            maxLength={150}
            autoComplete="organization"
          />
        </label>

        <label className="text-sm font-medium text-stone-700">
          Owner Name
          <input
            className={fieldClass}
            name="ownerName"
            value={formValues.ownerName}
            onChange={onChange}
            required
            maxLength={150}
            autoComplete="name"
          />
        </label>

        <label className="text-sm font-medium text-stone-700">
          Phone Number
          <input
            className={fieldClass}
            name="phoneNumber"
            type="tel"
            value={formValues.phoneNumber}
            onChange={onChange}
            required
            maxLength={30}
            autoComplete="tel"
            pattern="^[+]?[0-9\s\-()]{7,30}$"
            title="Phone number must be between 7 and 30 characters and contain only digits, spaces, hyphens, and parentheses."
          />
        </label>

        <label className="text-sm font-medium text-stone-700">
          Years of Experience
          <input
            className={fieldClass}
            name="experienceYears"
            type="number"
            value={formValues.experienceYears === 0 ? '' : formValues.experienceYears}
            onChange={onChange}
            required
            min={0}
          />
        </label>

        <label className="text-sm font-medium text-stone-700 md:col-span-2">
          Specialization
          <input
            className={fieldClass}
            name="specialization"
            value={formValues.specialization}
            onChange={onChange}
            required
            maxLength={150}
            placeholder="e.g. Electrical, Plumbing, Villa Construction"
          />
        </label>

        <label className="text-sm font-medium text-stone-700 md:col-span-2">
          Service Areas (comma-separated)
          <input
            className={fieldClass}
            name="serviceAreas"
            value={formValues.serviceAreas}
            onChange={onChange}
            maxLength={500}
            placeholder="e.g. Bengaluru, Mysuru, Whitefield"
          />
        </label>

        <label className="text-sm font-medium text-stone-700 md:col-span-2">
          Description / About Company
          <textarea
            className={`${fieldClass} min-h-28 resize-y`}
            name="description"
            value={formValues.description}
            onChange={onChange}
            maxLength={2000}
            placeholder="Describe your service offerings, company history, and key achievements..."
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
