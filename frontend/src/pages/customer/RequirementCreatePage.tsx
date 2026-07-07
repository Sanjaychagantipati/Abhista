import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomerPageShell } from '../../components/customer/CustomerPageShell'
import { RequirementCreateForm } from '../../components/customer/RequirementCreateForm'
import { RequirementService } from '../../services/customer/RequirementService'
import type { CreateRequirementRequest } from '../../types/customer/RequirementTypes'

const emptyForm: CreateRequirementRequest = {
  title: '',
  description: '',
  serviceCategory: '',
  location: '',
  budgetMin: 0,
  budgetMax: 0,
  preferredStartDate: null,
}

export function RequirementCreatePage() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<CreateRequirementRequest>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target
    setError(null)
    setValidationError(null)

    setFormValues((current) => {
      if (name === 'budgetMin' || name === 'budgetMax') {
        const numValue = value === '' ? 0 : Number(value)
        return { ...current, [name]: numValue }
      }
      return { ...current, [name]: value }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setValidationError(null)

    // Validation 1: Service Category (Property Type) must be selected
    if (!formValues.serviceCategory) {
      setValidationError('Please select a property type / category.')
      return
    }

    // Validation 2: Budget Min must be positive
    if (formValues.budgetMin <= 0) {
      setValidationError('Minimum budget must be greater than 0.')
      return
    }

    // Validation 3: Budget Max must be positive
    if (formValues.budgetMax <= 0) {
      setValidationError('Maximum budget must be greater than 0.')
      return
    }

    // Validation 4: Budget Max must be >= Budget Min
    if (formValues.budgetMax < formValues.budgetMin) {
      setValidationError('Maximum budget must be greater than or equal to minimum budget.')
      return
    }

    // Validation 5: Date must be today or in the future
    if (formValues.preferredStartDate) {
      const selectedDate = new Date(formValues.preferredStartDate)
      const today = new Date()
      // Reset time to compare dates only
      today.setHours(0, 0, 0, 0)
      selectedDate.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        setValidationError('Expected start date cannot be in the past.')
        return
      }
    }

    setSaving(true)

    // Map payload: convert empty preferredStartDate to null for clean JSON parsing on backend
    const apiPayload: CreateRequirementRequest = {
      ...formValues,
      preferredStartDate: formValues.preferredStartDate || null,
    }

    try {
      const response = await RequirementService.createRequirement(apiPayload)
      setSuccessMessage(response.message || 'Requirement created successfully!')
      
      // Wait 1 second and navigate to dashboard
      window.setTimeout(() => {
        navigate('/customer/dashboard')
      }, 1000)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An error occurred while saving the requirement.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <CustomerPageShell>
      <div className="grid gap-6">
        <section>
          <p className="text-sm font-medium uppercase text-emerald-700">New Requirement</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-950">Post Requirement</h1>
          <p className="mt-2 text-stone-600">
            Tell us about your project requirements to receive competitive bids and offers from verified professionals.
          </p>
        </section>

        {successMessage && (
          <div
            className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
            role="status"
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <RequirementCreateForm
          formValues={formValues}
          saving={saving}
          validationError={validationError}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </CustomerPageShell>
  )
}
