import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomerPageShell } from '../../components/customer/CustomerPageShell'
import { CustomerProfileForm } from '../../components/customer/CustomerProfileForm'
import { useCustomerDispatch, useCustomerSelector } from '../../hooks/customer/useCustomerStore'
import {
  clearCustomerProfileMessages,
  createCustomerProfile,
  loadCustomerProfile,
  updateCustomerProfile,
} from '../../store/customer/customerProfileSlice'
import type {
  CustomerProfile,
  CustomerProfileRequest,
} from '../../types/customer/customerProfileTypes'

const emptyForm: CustomerProfileRequest = {
  fullName: '',
  phoneNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
}

export function CustomerProfilePage() {
  const dispatch = useCustomerDispatch()
  const { profile, loading, saving, error, successMessage, loaded } = useCustomerSelector(
    (state) => state.customerProfile,
  )

  useEffect(() => {
    void dispatch(loadCustomerProfile())

    return () => {
      dispatch(clearCustomerProfileMessages())
    }
  }, [dispatch])

  const formInitialValues = profileToFormValues(profile)

  return (
    <CustomerPageShell>
      <div className="grid gap-6">
        <section>
          <p className="text-sm font-medium uppercase text-emerald-700">Customer Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-950">Profile Details</h1>
        </section>

        {loading && !loaded ? (
          <div className="rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600 shadow-sm">
            Loading profile...
          </div>
        ) : (
          <CustomerProfileEditor
            key={profile?.id ?? 'new-profile'}
            initialValues={formInitialValues}
            profileExists={Boolean(profile)}
            saving={saving}
          />
        )}

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
      </div>
    </CustomerPageShell>
  )
}

interface CustomerProfileEditorProps {
  initialValues: CustomerProfileRequest
  profileExists: boolean
  saving: boolean
}

function CustomerProfileEditor({
  initialValues,
  profileExists,
  saving,
}: CustomerProfileEditorProps) {
  const dispatch = useCustomerDispatch()
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<CustomerProfileRequest>(initialValues)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const action = profileExists
      ? updateCustomerProfile(formValues)
      : createCustomerProfile(formValues)
    const result = await dispatch(action)

    if (createCustomerProfile.fulfilled.match(result)) {
      window.setTimeout(() => {
        navigate('/customer/dashboard')
      }, 700)
      return
    }

    if (updateCustomerProfile.fulfilled.match(result)) {
      void dispatch(loadCustomerProfile())
    }
  }

  const submitLabel = profileExists ? 'Update Profile' : 'Save Profile'

  return (
    <CustomerProfileForm
      formValues={formValues}
      saving={saving}
      submitLabel={submitLabel}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}

function profileToFormValues(profile: CustomerProfile | null): CustomerProfileRequest {
  if (!profile) {
    return emptyForm
  }

  return {
    fullName: profile.fullName,
    phoneNumber: profile.phoneNumber,
    address: profile.address ?? '',
    city: profile.city,
    state: profile.state,
    pincode: profile.pincode,
  }
}
