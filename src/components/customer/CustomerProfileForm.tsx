import type { ChangeEvent, FormEvent } from 'react'
import type { CustomerProfileRequest } from '../../types/customer/customerProfileTypes'

interface CustomerProfileFormProps {
  formValues: CustomerProfileRequest
  saving: boolean
  submitLabel: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const fieldClass =
  'mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'

export function CustomerProfileForm({
  formValues,
  saving,
  submitLabel,
  onChange,
  onSubmit,
}: CustomerProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium text-stone-700">
          Full Name
          <input
            className={fieldClass}
            name="fullName"
            value={formValues.fullName}
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
            value={formValues.phoneNumber}
            onChange={onChange}
            required
            maxLength={30}
            autoComplete="tel"
          />
        </label>

        <label className="text-sm font-medium text-stone-700 md:col-span-2">
          Address
          <textarea
            className={`${fieldClass} min-h-24 resize-y`}
            name="address"
            value={formValues.address}
            onChange={onChange}
            maxLength={500}
          />
        </label>

        <label className="text-sm font-medium text-stone-700">
          City
          <input
            className={fieldClass}
            name="city"
            value={formValues.city}
            onChange={onChange}
            required
            maxLength={100}
            autoComplete="address-level2"
          />
        </label>

        <label className="text-sm font-medium text-stone-700">
          State
          <input
            className={fieldClass}
            name="state"
            value={formValues.state}
            onChange={onChange}
            required
            maxLength={100}
            autoComplete="address-level1"
          />
        </label>

        <label className="text-sm font-medium text-stone-700">
          Pincode
          <input
            className={fieldClass}
            name="pincode"
            value={formValues.pincode}
            onChange={onChange}
            required
            maxLength={20}
            autoComplete="postal-code"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
