import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutButton } from '../auth/LogoutButton';
import { useAuth } from '../../hooks/auth/useAuth';
import type { AvailabilityStatus } from '../../types/provider/providerTypes';

interface ProviderDashboardLayoutProps {
  children: ReactNode;
  activeStatus?: AvailabilityStatus;
  onStatusChange?: (status: AvailabilityStatus) => void;
}

export function ProviderDashboardLayout({
  children,
  activeStatus = 'AVAILABLE',
  onStatusChange,
}: ProviderDashboardLayoutProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navLinkClass = "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition";

  return (
    <main className="min-h-screen bg-[#f8fafc] text-stone-900 font-sans flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-stone-200 hidden md:flex flex-col justify-between sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl font-bold tracking-tight text-emerald-700 font-serif">Abhista</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">Partner</span>
          </div>

          <nav className="mt-8 flex flex-col gap-1.5">
            <button onClick={() => navigate('/contractor/dashboard')} className={navLinkClass}>
              📊 Dashboard
            </button>
            <button onClick={() => navigate('/contractor/profile')} className={navLinkClass}>
              👤 My Profile
            </button>
            <button onClick={() => navigate('/contractor/portfolio')} className={navLinkClass}>
              💼 Portfolio
            </button>
            <button onClick={() => navigate('/contractor/leads')} className={navLinkClass}>
              📋 Booking Requests
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-stone-100 flex flex-col gap-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition"
          >
            🏠 Marketplace Home
          </button>
          <div className="px-4 py-2">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="bg-white border-b border-stone-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-stone-900">Partner Control Center</h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Availability Switcher */}
            {onStatusChange && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider hidden sm:inline">Availability:</span>
                <select
                  value={activeStatus}
                  onChange={(e) => onStatusChange(e.target.value as AvailabilityStatus)}
                  className="text-xs font-bold rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="AVAILABLE">🟢 Available</option>
                  <option value="BUSY">🟡 Busy</option>
                  <option value="ON_LEAVE">🔴 On Leave</option>
                </select>
              </div>
            )}

            <div className="h-8 w-px bg-stone-200"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-full">
                👤 {user?.firstName}
              </span>
            </div>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </div>
    </main>
  );
}
