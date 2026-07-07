import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CustomerPageShell } from '../../components/customer/CustomerPageShell'
import { ProfileCompletionStatus } from '../../components/customer/ProfileCompletionStatus'
import { useCustomerDispatch, useCustomerSelector } from '../../hooks/customer/useCustomerStore'
import { loadCustomerProfile } from '../../store/customer/customerProfileSlice'

function getStoredName() {
  const rawUser = localStorage.getItem('user')

  if (!rawUser) {
    return 'Customer'
  }

  try {
    const parsedUser = JSON.parse(rawUser) as { firstName?: string; fullName?: string }
    return parsedUser.fullName ?? parsedUser.firstName ?? 'Customer'
  } catch {
    return 'Customer'
  }
}

export function CustomerDashboard() {
  const dispatch = useCustomerDispatch()
  const { profile, loading } = useCustomerSelector((state) => state.customerProfile)
  const displayName = profile?.fullName ?? getStoredName()
  const profileComplete = Boolean(profile)

  useEffect(() => {
    void dispatch(loadCustomerProfile())
  }, [dispatch])

  return (
    <CustomerPageShell>
      <div className="grid gap-6">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase text-emerald-700">Customer Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-950 sm:text-4xl">
            Welcome, {displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-stone-600">
            Manage your profile before creating construction or home service requirements.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <ProfileCompletionStatus isComplete={profileComplete} />

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950">Quick Actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/customer/profile"
                className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                {profileComplete ? 'Edit Profile' : 'Complete Profile'}
              </Link>
              {profileComplete ? (
                <Link
                  to="/customer/requirements/create"
                  className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Create Requirement
                </Link>
              ) : (
                <button
                  disabled
                  title="Please complete your profile to create requirements"
                  className="inline-flex items-center justify-center rounded-md bg-stone-300 px-4 py-2 text-sm font-semibold text-stone-500 cursor-not-allowed"
                >
                  Create Requirement
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
    </CustomerPageShell>
  )
}
