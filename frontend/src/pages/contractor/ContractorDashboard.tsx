import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ContractorPageShell } from '../../components/contractor/ContractorPageShell'
import { ContractorProfileStatus } from '../../components/contractor/ContractorProfileStatus'
import { useContractorDispatch, useContractorSelector } from '../../hooks/contractor/useContractorStore'
import { loadContractorProfile } from '../../store/contractor/contractorProfileSlice'

function getStoredName() {
  const rawUser = localStorage.getItem('user')
  if (!rawUser) {
    return 'Contractor'
  }
  try {
    const parsedUser = JSON.parse(rawUser) as { firstName?: string; fullName?: string }
    return parsedUser.fullName ?? parsedUser.firstName ?? 'Contractor'
  } catch {
    return 'Contractor'
  }
}

export function ContractorDashboard() {
  const dispatch = useContractorDispatch()
  const { profile, loading } = useContractorSelector((state) => state.contractorProfile)

  const displayName = profile?.companyName ?? profile?.ownerName ?? getStoredName()
  const profileComplete = Boolean(profile)

  useEffect(() => {
    void dispatch(loadContractorProfile())
  }, [dispatch])

  return (
    <ContractorPageShell>
      <div className="grid gap-6">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md">
          <p className="text-sm font-semibold uppercase text-amber-700">Contractor Portal</p>
          <h1 className="mt-3 text-3xl font-bold text-stone-950 sm:text-4xl">
            Welcome, {displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-stone-600">
            Grow your business with Abhista. Keep your profile updated to verify your business credentials and start accepting requirements.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            <ContractorProfileStatus profile={profile} />

            {profileComplete && (
              <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-stone-950">Profile Summary</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-stone-50 p-3">
                    <p className="text-xs font-medium text-stone-500 uppercase">Owner Name</p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">{profile?.ownerName}</p>
                  </div>
                  <div className="rounded-md bg-stone-50 p-3">
                    <p className="text-xs font-medium text-stone-500 uppercase">Contact Number</p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">{profile?.phoneNumber}</p>
                  </div>
                  <div className="rounded-md bg-stone-50 p-3">
                    <p className="text-xs font-medium text-stone-500 uppercase">Specialization</p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">{profile?.specialization}</p>
                  </div>
                  <div className="rounded-md bg-stone-50 p-3">
                    <p className="text-xs font-medium text-stone-500 uppercase">Experience</p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">{profile?.experienceYears} Years</p>
                  </div>
                  {profile?.serviceAreas && (
                    <div className="rounded-md bg-stone-50 p-3 sm:col-span-2">
                      <p className="text-xs font-medium text-stone-500 uppercase">Service Areas</p>
                      <p className="mt-1 text-sm font-semibold text-stone-950">{profile.serviceAreas}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm self-start">
            <h2 className="text-lg font-semibold text-stone-950">Quick Actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/contractor/profile"
                className="inline-flex items-center justify-center rounded-md bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                {profileComplete ? 'Edit Profile' : 'Complete Profile'}
              </Link>
              {profileComplete ? (
                <Link
                  to="/contractor/leads"
                  className="inline-flex items-center justify-center rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  View Open Requirements
                </Link>
              ) : (
                <button
                  disabled
                  title="Please complete your profile to view requirements"
                  className="inline-flex items-center justify-center rounded-md bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-400 cursor-not-allowed border border-stone-200"
                >
                  View Open Requirements
                </button>
              )}
            </div>
          </section>
        </div>

        {loading && (
          <p className="rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600">
            Loading profile status...
          </p>
        )}
      </div>
    </ContractorPageShell>
  )
}

