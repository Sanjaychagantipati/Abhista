import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryApi } from '../services/category/categoryService';
import { callbackApi } from '../services/callback/callbackService';
import { validateCallbackRequest, validateEmail } from '../utils/callbackValidation';
import type { ServiceCategory } from '../types/category/categoryTypes';
import type { CallbackRequest } from '../types/callback/callbackTypes';

export function RequestCallbackPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [preferredLanguage, setPreferredLanguage] = useState('Telugu');
  const [serviceCategoryId, setServiceCategoryId] = useState('');
  const [projectType, setProjectType] = useState('Renovation');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [preferredCallTime, setPreferredCallTime] = useState('Anytime');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<CallbackRequest | null>(null);

  // Status tracking states
  const [trackRef, setTrackRef] = useState('');
  const [trackedStatus, setTrackedStatus] = useState<CallbackRequest | null>(null);
  const [trackError, setTrackError] = useState('');
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await categoryApi.getCategories();
        setCategories(list);
      } catch (err: any) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmittedRequest(null);

    const validation = validateCallbackRequest(fullName, phoneNumber);
    if (!validation.valid) {
      setError(validation.error || 'Form validation failed');
      return;
    }

    if (email && !validateEmail(email)) {
      setError('Please enter a valid email format');
      return;
    }

    setLoading(true);
    try {
      const response = await callbackApi.createCallback({
        fullName,
        phoneNumber,
        email: email || undefined,
        city,
        state,
        preferredLanguage,
        serviceCategoryId: serviceCategoryId ? Number(serviceCategoryId) : undefined,
        projectType,
        estimatedBudget: estimatedBudget ? Number(estimatedBudget) : undefined,
        preferredCallTime,
        message,
        source: 'Website',
      });
      setSubmittedRequest(response);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to submit callback request');
    } finally {
      setLoading(false);
    }
  }

  async function handleTrackStatus(e: React.FormEvent) {
    e.preventDefault();
    setTrackError('');
    setTrackedStatus(null);

    if (!trackRef.trim()) {
      setTrackError('Please enter a reference number');
      return;
    }

    setTracking(true);
    try {
      const response = await callbackApi.trackCallbackStatus(trackRef.trim());
      setTrackedStatus(response);
    } catch (err: any) {
      setTrackError(err.response?.data?.message || err.message || 'Reference number not found');
    } finally {
      setTracking(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] text-stone-900 font-sans pb-16">
      {/* Header bar */}
      <header className="border-b border-stone-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-bold tracking-tight text-emerald-700 font-serif">Abhista</span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Callback center</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 transition"
          >
            ← Return to Marketplace
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 grid gap-8 lg:grid-cols-3">
        {/* Left Column: Input Form sheets */}
        <section className="lg:col-span-2 space-y-6">
          {submittedRequest ? (
            <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm text-center">
              <span className="text-5xl">🎉</span>
              <h2 className="mt-4 text-2xl font-bold text-emerald-950 font-serif">Callback Request Submitted!</h2>
              <p className="mt-2 text-sm text-stone-600">
                An expert coordinator from Abhista will call you to plan your project details.
              </p>
              <div className="mt-6 inline-block bg-stone-50 border border-stone-200 px-6 py-3 rounded-lg">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-400">Your Reference Number</span>
                <strong className="text-lg font-mono text-stone-900 select-all">{submittedRequest.referenceNumber}</strong>
              </div>
              <p className="mt-4 text-xs text-stone-400">Copy and save this reference number to track call progress.</p>
              <button
                onClick={() => setSubmittedRequest(null)}
                className="mt-8 rounded-md bg-stone-900 px-5 py-2 text-xs font-bold text-white hover:bg-stone-800 transition"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold text-stone-950 font-serif">Talk to our Experts</h2>
              <p className="mt-1 text-sm text-stone-500">
                Provide your contact information and details. We will call you for a free consultation.
              </p>

              {error && (
                <div className="mt-4 rounded-md bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanjay Chagantipati"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Preferred Language</label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                    >
                      <option>Telugu</option>
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Tamil</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Service Category (Optional)</label>
                    <select
                      value={serviceCategoryId}
                      onChange={(e) => setServiceCategoryId(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="">Select Service</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Project Type</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                    >
                      <option>Home Construction</option>
                      <option>Renovation</option>
                      <option>Interior Design</option>
                      <option>Waterproofing</option>
                      <option>Electrical/Plumbing Planning</option>
                      <option>Budget Planning</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Estimated Budget (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={estimatedBudget}
                      onChange={(e) => setEstimatedBudget(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Preferred Call Time</label>
                    <select
                      value={preferredCallTime}
                      onChange={(e) => setPreferredCallTime(e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none bg-white"
                    >
                      <option>Anytime</option>
                      <option>Morning (9 AM - 12 PM)</option>
                      <option>Afternoon (12 PM - 4 PM)</option>
                      <option>Evening (4 PM - 7 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Message / Project Brief</label>
                  <textarea
                    placeholder="Provide details about the work required..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-md border border-stone-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-emerald-700 py-3 text-sm font-semibold text-white hover:bg-emerald-800 transition shadow disabled:opacity-50"
                >
                  {loading ? 'Registering request...' : 'Submit Callback Request'}
                </button>
              </form>
            </div>
          )}
        </section>

        {/* Right Column: Track status widget */}
        <section className="space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 font-serif">Track Callback Request</h3>
            <p className="text-xs text-stone-500 mt-1">Already submitted a request? Check its status here.</p>

            {trackError && (
              <div className="mt-3 rounded-md bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                {trackError}
              </div>
            )}

            <form onSubmit={handleTrackStatus} className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Enter Reference Number"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                className="w-full rounded-md border border-stone-200 px-3 py-2 text-xs focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={tracking}
                className="w-full rounded-md bg-stone-900 py-2 text-xs font-bold text-white hover:bg-stone-850 transition disabled:opacity-50"
              >
                {tracking ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {trackedStatus && (
              <div className="mt-5 border-t border-stone-100 pt-4 space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Status</span>
                  <p className="mt-0.5 text-sm font-extrabold text-emerald-850">{trackedStatus.status}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Name</span>
                  <p className="text-xs text-stone-700">{trackedStatus.fullName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Preferred Time</span>
                  <p className="text-xs text-stone-700">{trackedStatus.preferredCallTime}</p>
                </div>
                {trackedStatus.categoryName && (
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Category</span>
                    <p className="text-xs text-stone-700">{trackedStatus.categoryName}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
