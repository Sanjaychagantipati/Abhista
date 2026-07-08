import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContractorPageShell } from '../../components/contractor/ContractorPageShell'
import { ContractorProfileForm } from '../../components/contractor/ContractorProfileForm'
import { useContractorDispatch, useContractorSelector } from '../../hooks/contractor/useContractorStore'
import {
  clearContractorProfileMessages,
  createContractorProfile,
  loadContractorProfile,
  updateContractorProfile,
} from '../../store/contractor/contractorProfileSlice'
import type {
  ContractorProfile,
  ContractorProfileRequest,
} from '../../types/contractor/contractorProfileTypes'

const emptyForm: ContractorProfileRequest = {
  companyName: '',
  ownerName: '',
  phoneNumber: '',
  experienceYears: 0,
  specialization: '',
  serviceAreas: '',
  description: '',
}

export function ContractorProfilePage() {
  const dispatch = useContractorDispatch()
  const { profile, loading, saving, error, successMessage, loaded } = useContractorSelector(
    (state) => state.contractorProfile,
  )

  useEffect(() => {
    void dispatch(loadContractorProfile())

    return () => {
      dispatch(clearContractorProfileMessages())
    }
  }, [dispatch])

  const formInitialValues = profileToFormValues(profile)

  return (
    <ContractorPageShell>
      <div className="grid gap-6">
        <section>
          <p className="text-sm font-semibold uppercase text-amber-700">Contractor Profile</p>
          <h1 className="mt-3 text-3xl font-bold text-stone-950">Company Profile Details</h1>
        </section>

        {loading && !loaded ? (
          <div className="rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600 shadow-sm">
            Loading profile details...
          </div>
        ) : (
          <ContractorProfileEditor
            key={profile?.id ?? 'new-contractor-profile'}
            initialValues={formInitialValues}
            profileExists={Boolean(profile)}
            saving={saving}
          />
        )}

        {successMessage && (
          <div
            className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
            role="status"
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    </ContractorPageShell>
  )
}

interface ContractorProfileEditorProps {
  initialValues: ContractorProfileRequest
  profileExists: boolean
  saving: boolean
}

function ContractorProfileEditor({
  initialValues,
  profileExists,
  saving,
}: ContractorProfileEditorProps) {
  const dispatch = useContractorDispatch()
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState<ContractorProfileRequest>(initialValues)

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    
    // Parse experienceYears as integer
    if (name === 'experienceYears') {
      const parsed = parseInt(value, 10)
      setFormValues((current) => ({ ...current, [name]: isNaN(parsed) ? 0 : parsed }))
    } else {
      setFormValues((current) => ({ ...current, [name]: value }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const action = profileExists
      ? updateContractorProfile(formValues)
      : createContractorProfile(formValues)
    const result = await dispatch(action)

    if (createContractorProfile.fulfilled.match(result)) {
      window.setTimeout(() => {
        navigate('/contractor/dashboard')
      }, 700)
      return
    }

    if (updateContractorProfile.fulfilled.match(result)) {
      void dispatch(loadContractorProfile())
    }
  }

  const submitLabel = profileExists ? 'Update Profile' : 'Save Profile'

  return (
    <ContractorProfileForm
      formValues={formValues}
      saving={saving}
      submitLabel={submitLabel}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}

function profileToFormValues(profile: ContractorProfile | null): ContractorProfileRequest {
  if (!profile) {
    return emptyForm
  }

  return {
    companyName: profile.companyName,
    ownerName: profile.ownerName,
    phoneNumber: profile.phoneNumber,
    experienceYears: profile.experienceYears,
    specialization: profile.specialization,
    serviceAreas: profile.serviceAreas ?? '',
    description: profile.description ?? '',
  }
}
