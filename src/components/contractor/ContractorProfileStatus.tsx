import type { ContractorProfile } from '../../types/contractor/contractorProfileTypes'

interface ContractorProfileStatusProps {
  profile: ContractorProfile | null
}

export function ContractorProfileStatus({ profile }: ContractorProfileStatusProps) {

  const getStatusBadge = () => {
    if (!profile) {
      return (
        <span className="inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
          Incomplete
        </span>
      )
    }

    switch (profile.verificationStatus) {
      case 'VERIFIED':
        return (
          <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            Verified
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex w-fit rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            Rejected
          </span>
        )
      case 'PENDING':
      default:
        return (
          <span className="inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            Verification Pending
          </span>
        )
    }
  }

  const getStatusDescription = () => {
    if (!profile) {
      return 'Please complete your contractor profile to start reviewing and accepting client requirements.'
    }

    switch (profile.verificationStatus) {
      case 'VERIFIED':
        return 'Your contractor profile is verified. You can bid and accept project requirements.'
      case 'REJECTED':
        return 'Your profile verification was rejected. Please review your details or contact support.'
      case 'PENDING':
      default:
        return 'Your profile is submitted and currently under review by our administration team.'
    }
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Profile Status</h2>
          <p className="mt-1 text-sm text-stone-600">{getStatusDescription()}</p>
        </div>
        {getStatusBadge()}
      </div>
    </section>
  )
}
