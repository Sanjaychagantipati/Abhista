import { useEffect, useState } from 'react';
import { providerApi } from '../../services/provider/providerService';
import { ProviderDashboardLayout } from '../../components/contractor/ProviderDashboardLayout';
import type { ProviderDashboardSummary, AvailabilityStatus } from '../../types/provider/providerTypes';

export function ContractorDashboard() {
  const [summary, setSummary] = useState<ProviderDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadDashboard() {
    try {
      setLoading(true);
      setError('');
      const data = await providerApi.getDashboardSummary();
      setSummary(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard summary');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function handleStatusChange(status: AvailabilityStatus) {
    if (!summary) return;
    try {
      setMessage('');
      await providerApi.updateAvailability(status);
      setSummary((curr) => curr ? {
        ...curr,
        availabilityStatus: status,
        profile: { ...curr.profile, availabilityStatus: status }
      } : null);
      setMessage('Availability status updated successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-stone-500 font-medium">Loading dashboard control center...</div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="bg-white p-6 rounded-lg shadow max-w-md border border-stone-200">
          <h2 className="text-xl font-bold text-rose-800">Error Loading Dashboard</h2>
          <p className="mt-2 text-sm text-stone-600">{error || 'Unable to retrieve summary stats'}</p>
          <button onClick={loadDashboard} className="mt-4 bg-stone-900 text-white px-4 py-2 text-sm rounded font-semibold">
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const { profile, profileCompletion, verificationStatus, subscription, stats, recentBookings, recentRequirements, recentReviews, notifications } = summary;

  return (
    <ProviderDashboardLayout activeStatus={profile.availabilityStatus} onStatusChange={handleStatusChange}>
      <div className="space-y-6">
        {/* Welcome Card / Status row */}
        <section className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif">Welcome back, {profile.fullName}!</h1>
            <p className="mt-1.5 text-sm text-emerald-100 font-medium">
              Registered Category: <strong className="text-white">{profile.categoryName}</strong> | Status: <strong>{verificationStatus}</strong>
            </p>
          </div>
          {message && (
            <span className="bg-white/20 text-white px-3 py-1 rounded text-xs font-semibold">
              {message}
            </span>
          )}
        </section>

        {/* Profile completion / subscription row */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Completion Card */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Profile Completion</h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 bg-stone-100 rounded-full h-3.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${profileCompletion}%` }}></div>
              </div>
              <span className="text-sm font-bold text-stone-700">{profileCompletion}%</span>
            </div>
            <p className="mt-2 text-[10px] text-stone-500">Completing your business profile improves booking conversion by 40%.</p>
          </div>

          {/* Premium Subscription Card */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Active Subscription</h3>
            {subscription ? (
              <div className="mt-3">
                <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {subscription.planName}
                </span>
                <p className="mt-2 text-xs text-stone-500 font-medium">Expires: {new Date(subscription.endDate).toLocaleDateString()}</p>
              </div>
            ) : (
              <div className="mt-3">
                <span className="text-sm font-bold text-stone-500 bg-stone-50 px-2 py-0.5 rounded">
                  No Premium Access
                </span>
                <p className="mt-2 text-[10px] text-rose-800">Phone numbers are currently masked from customer details.</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Verification Status</h3>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                verificationStatus === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
              }`}>
                {verificationStatus === 'VERIFIED' ? '🛡️ Profile Verified' : '⏳ Pending Review'}
              </span>
            </div>
          </div>
        </div>

        {/* Numeric Stats Widgets */}
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Pending Bookings</h4>
            <p className="text-2xl font-bold text-stone-900 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Accepted Bookings</h4>
            <p className="text-2xl font-bold text-stone-900 mt-2">{stats.accepted}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Average Rating</h4>
            <p className="text-2xl font-bold text-stone-900 mt-2">⭐ {stats.averageRating}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Projects Uploaded</h4>
            <p className="text-2xl font-bold text-stone-900 mt-2">{stats.portfolioCount}</p>
          </div>
        </section>

        {/* Dashboard Feeds */}
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left Column: Recent Bookings & Matched Requirements */}
          <div className="space-y-6">
            {/* Recent Booking Requests */}
            <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
              <h2 className="text-lg font-bold text-stone-900">Recent Booking Requests</h2>
              <div className="mt-4 divide-y divide-stone-100">
                {recentBookings.length === 0 ? (
                  <p className="text-stone-500 text-xs py-4">No booking requests received yet.</p>
                ) : (
                  recentBookings.map((b) => (
                    <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-800">Booking {b.bookingNumber}</span>
                          <span className="text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{b.bookingStatus}</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">Client: {b.customer?.firstName} {b.customer?.lastName}</p>
                        <p className="text-xs text-stone-400">Schedule: {new Date(b.preferredDate).toLocaleDateString()} at {b.preferredTime}</p>
                      </div>
                      <span className="text-xs font-bold text-stone-600">
                        📍 {b.city}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Matched Customer Requirements */}
            <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
              <h2 className="text-lg font-bold text-stone-900">Matching Client Service Requests</h2>
              <p className="text-xs text-stone-500 mt-1">Customer requirements matching your work category ({profile.categoryName}).</p>
              <div className="mt-4 divide-y divide-stone-100">
                {recentRequirements.length === 0 ? (
                  <p className="text-stone-500 text-xs py-4">No active requirement requests found in your area.</p>
                ) : (
                  recentRequirements.map((r) => (
                    <div key={r.id} className="py-4 flex flex-col justify-between gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{r.title}</h4>
                          <p className="text-xs text-stone-500 mt-0.5">Budget: ₹{r.estimatedBudget || 'Quote requested'} | Date: {new Date(r.preferredStartDate).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">📍 {r.city}</span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2">{r.description}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Reviews & Notifications */}
          <div className="space-y-6">
            {/* Notifications Alert Board */}
            <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400">Activity Logs</h2>
              <div className="mt-4 space-y-3.5">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-3">
                    <span className="text-lg">🔔</span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{n.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">{n.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Customer Reviews Feed */}
            <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-400">Recent Customer Reviews</h2>
              <div className="mt-4 divide-y divide-stone-100">
                {recentReviews.length === 0 ? (
                  <p className="text-stone-500 text-xs py-4">No reviews received yet.</p>
                ) : (
                  recentReviews.map((rev) => (
                    <div key={rev.id} className="py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-stone-800">{rev.customer?.firstName} {rev.customer?.lastName}</span>
                        <span className="text-xs text-amber-500">⭐ {rev.rating}</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 italic">"{rev.comment || 'No review message left.'}"</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </ProviderDashboardLayout>
  );
}
