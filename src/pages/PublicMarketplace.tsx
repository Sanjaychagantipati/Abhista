import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryApi } from '../services/category/categoryService';
import { providerApi } from '../services/provider/providerService';
import { subscriptionApi } from '../services/subscription/subscriptionService';
import { useAuth } from '../hooks/auth/useAuth';
import { hasPremiumAccess } from '../utils/subscriptionGuard';
import type { ServiceCategory } from '../types/category/categoryTypes';
import type { ProviderProfile } from '../types/provider/providerTypes';
import type { UserSubscription } from '../types/subscription/subscriptionTypes';

export function PublicMarketplace() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, response] = await Promise.all([
          categoryApi.getCategories(),
          providerApi.listProviders({}),
        ]);
        setCategories(cats);
        setProviders(response.data);

        if (isAuthenticated && user?.role === 'ROLE_CUSTOMER') {
          const sub = await subscriptionApi.getMySubscription();
          setSubscription(sub);
        }
      } catch (err: any) {
        console.error('Failed to load marketplace content', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated, user]);

  async function handleProviderClick(providerId: string) {
    try {
      const details = await providerApi.getProvider(providerId);
      setSelectedProvider(details);
    } catch (err: any) {
      console.error(err);
    }
  }

  function handleBookService(provider: ProviderProfile) {
    if (!isAuthenticated) {
      const target = encodeURIComponent(`/book-service?providerId=${provider.id}&categoryId=${provider.categoryId}`);
      navigate(`/login?redirect=${target}`);
      return;
    }

    if (user?.role !== 'ROLE_CUSTOMER') {
      setMessage('Only customers can book providers.');
      return;
    }

    navigate(`/book-service?providerId=${provider.id}&categoryId=${provider.categoryId}`);
  }

  const filteredProviders = providers.filter((p) => {
    const matchesSearch = p.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          (p.businessName && p.businessName.toLowerCase().includes(search.toLowerCase())) ||
                          (p.city && p.city.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const featuredConsultants = providers.filter((p) => p.canProvideConsultation);

  const premiumAccess = subscription ? hasPremiumAccess(subscription) : false;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-stone-900 font-sans">
      {/* Dynamic Header */}
      <header className="border-b border-stone-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-emerald-700 font-serif cursor-pointer" onClick={() => navigate('/')}>
              Abhista
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              2.0 Marketplace
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-stone-600">
                  Logged in as: <strong className="text-stone-900">{user?.firstName || 'User'}</strong>
                </span>
                <button
                  onClick={() => {
                    if (user?.role === 'ROLE_CUSTOMER') navigate('/customer/dashboard');
                    else if (user?.role === 'ROLE_PROVIDER') navigate('/contractor/dashboard');
                    else navigate('/admin/dashboard');
                  }}
                  className="rounded-md bg-stone-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-stone-850 shadow"
                >
                  My Workspace
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-xs font-bold text-stone-700 hover:text-stone-950 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="rounded-md bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-800 shadow"
                >
                  Join as Partner
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner & Search Bar */}
      <section className="bg-gradient-to-r from-emerald-950 to-emerald-850 py-20 text-center text-white relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl font-serif">
            Find & Book Local Construction Experts
          </h1>
          <p className="mt-5 text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Instantly connect with verified Plumbers, Electricians, Architects, and Builders in your neighborhood.
          </p>

          {/* Search Box */}
          <div className="mt-10 mx-auto max-w-xl bg-white p-2 rounded-lg shadow-lg flex gap-2">
            <input
              type="text"
              placeholder="Search services, providers, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 text-stone-900 focus:outline-none text-sm rounded-md"
            />
            <button className="bg-emerald-700 px-6 py-2.5 rounded-md font-bold text-sm text-white hover:bg-emerald-800 transition">
              Search
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_100%)]"></div>
      </section>

      {/* Callback Request Banner */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-stone-900 to-stone-850 p-6 sm:p-8 text-white shadow flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">Not sure where to start?</h3>
            <p className="text-stone-300 text-sm mt-1">Talk to our experts. Request a free callback to plan your home construction or renovation project.</p>
          </div>
          <button
            onClick={() => navigate('/request-callback')}
            className="whitespace-nowrap rounded-lg bg-emerald-600 px-6 py-3 font-bold text-sm text-white hover:bg-emerald-700 transition shadow"
          >
            Request a Callback
          </button>
        </div>
      </section>

      {/* Main Grid: Browse and Listings */}
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        {message && (
          <div className="mb-6 rounded-md bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Service Categories Sidebar */}
          <aside className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">Categories</h2>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition ${
                  selectedCategory === null ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                All Services
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition ${
                    selectedCategory === cat.id ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Listings and Sections */}
          <div className="space-y-12">
            {/* Providers Search Results */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <h2 className="text-xl font-bold text-stone-900">
                  {selectedCategory ? categories.find((c) => c.id === selectedCategory)?.name : 'Service Providers'}
                </h2>
                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  {filteredProviders.length} Partners
                </span>
              </div>

              {loading ? (
                <p className="text-stone-500 text-sm">Loading partners...</p>
              ) : filteredProviders.length === 0 ? (
                <div className="rounded-lg border border-dashed border-stone-300 p-12 text-center">
                  <p className="text-stone-600 text-sm">No partners match your criteria.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProviders.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-emerald-200"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Verified</span>
                        </div>
                        <h3 className="mt-3 text-lg font-bold text-stone-900">{p.fullName}</h3>
                        {p.businessName && (
                          <p className="text-xs font-medium text-stone-500">{p.businessName}</p>
                        )}
                        <p className="mt-2 text-xs text-stone-400 font-medium">📍 {p.city}, {p.state}</p>
                        <p className="mt-3 text-sm text-stone-600 line-clamp-3 leading-relaxed">
                          {p.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-stone-100 flex gap-2">
                        <button
                          onClick={() => handleProviderClick(p.id)}
                          className="flex-1 rounded-md border border-stone-200 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleBookService(p)}
                          className="flex-1 rounded-md bg-emerald-700 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition shadow"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Featured Consultants */}
            {featuredConsultants.length > 0 && (
              <section className="space-y-6 pt-6 border-t border-stone-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">Featured Design Consultants</h2>
                  <p className="text-sm text-stone-500 mt-1">Book virtual slots and consultations with registered Architects and Civil Engineers.</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredConsultants.map((c) => (
                    <div key={c.id} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:border-emerald-200 transition">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                        Architect / Designer
                      </span>
                      <h3 className="mt-3 text-lg font-bold text-stone-900">{c.fullName}</h3>
                      <p className="text-xs text-stone-500">{c.businessName}</p>
                      <p className="mt-3 text-sm text-stone-600 line-clamp-2">{c.description}</p>
                      <button
                        onClick={() => handleProviderClick(c.id)}
                        className="mt-4 w-full rounded-md bg-stone-950 py-2 text-xs font-semibold text-white hover:bg-stone-850 transition"
                      >
                        Request Consultation
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Why Choose Abhista */}
            <section className="space-y-6 pt-12 border-t border-stone-200">
              <h2 className="text-2xl font-bold text-center text-stone-950 font-serif">Why Choose Abhista</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm text-center">
                  <span className="text-3xl">🛡️</span>
                  <h4 className="mt-3 font-bold text-stone-900">Verified Profiles</h4>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">Every provider undergoes profile review and verification by platform administrators.</p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm text-center">
                  <span className="text-3xl">💸</span>
                  <h4 className="mt-3 font-bold text-stone-900">No Booking Fees</h4>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">Submit booking requests directly. Pay only the provider after the job completion.</p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-sm text-center">
                  <span className="text-3xl">👷</span>
                  <h4 className="mt-3 font-bold text-stone-900">Premium Contractors</h4>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">Direct access to professional white-collar designers and structural engineers.</p>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section className="space-y-6 py-8">
              <h2 className="text-2xl font-bold text-center text-stone-950 font-serif">How It Works</h2>
              <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
                <div className="text-center max-w-[200px] mx-auto">
                  <span className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center">1</span>
                  <h4 className="mt-3 font-bold text-sm">Browse & Filter</h4>
                  <p className="mt-1 text-xs text-stone-500">Search partners by location and categories.</p>
                </div>
                <div className="text-center max-w-[200px] mx-auto">
                  <span className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center">2</span>
                  <h4 className="mt-3 font-bold text-sm">Request Booking</h4>
                  <p className="mt-1 text-xs text-stone-500">Pick preferred slots and detail notes.</p>
                </div>
                <div className="text-center max-w-[200px] mx-auto">
                  <span className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold inline-flex items-center justify-center">3</span>
                  <h4 className="mt-3 font-bold text-sm">Partner Confirms</h4>
                  <p className="mt-1 text-xs text-stone-500">The partner accepts and begins the job.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-12 mt-16 text-center text-stone-500 text-xs">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Abhista Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-stone-900 cursor-pointer">About Us</span>
            <span className="hover:text-stone-900 cursor-pointer">Contact Support</span>
            <span className="hover:text-stone-900 cursor-pointer">Terms & Conditions</span>
          </div>
        </div>
      </footer>

      {/* Details overlay modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProvider(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-xl font-bold"
            >
              ✕
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              Partner Profile
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-stone-950 font-serif">{selectedProvider.fullName}</h2>
            {selectedProvider.businessName && (
              <p className="text-stone-500 font-semibold">{selectedProvider.businessName}</p>
            )}

            <div className="mt-6 grid gap-4 border-t border-stone-200 pt-6 sm:grid-cols-2">
              <div>
                <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Experience</h4>
                <p className="mt-1 text-sm font-medium text-stone-900">{selectedProvider.experienceYears} Years</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Location</h4>
                <p className="mt-1 text-sm font-medium text-stone-900">{selectedProvider.city}, {selectedProvider.state}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Category</h4>
                <p className="mt-1 text-sm font-medium text-stone-900">{selectedProvider.category?.name || 'Home Services'}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Phone / WhatsApp</h4>
                <p className="mt-1 text-sm font-medium text-stone-900 flex items-center gap-1.5">
                  📞 {selectedProvider.phoneNumber}
                  {!premiumAccess && user?.role !== 'ROLE_ADMIN' && String(selectedProvider.userId) !== String(user?.id) && (
                    <span className="text-[10px] font-semibold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full">
                      Premium locked
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-stone-200 pt-6">
              <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">About Business</h4>
              <p className="mt-2 text-sm text-stone-700 leading-relaxed">
                {selectedProvider.description || 'No business description registered.'}
              </p>
            </div>

            <div className="mt-8 flex gap-3 justify-end border-t border-stone-100 pt-6">
              <button
                onClick={() => setSelectedProvider(null)}
                className="rounded-md border border-stone-200 px-5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                Close Profile
              </button>
              <button
                onClick={() => handleBookService(selectedProvider)}
                className="rounded-md bg-emerald-700 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition shadow"
              >
                Book Service Request
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
