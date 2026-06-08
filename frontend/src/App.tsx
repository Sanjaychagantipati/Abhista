import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages/auth/LoginPage'
import { CustomerDashboard } from './pages/customer/CustomerDashboard'
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage'
import { ProtectedRoute } from './routes/ProtectedRoute'

interface RoleDashboardPlaceholderProps {
  title: string
}

function RoleDashboardPlaceholder({ title }: RoleDashboardPlaceholderProps) {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-10 text-stone-950">
      <section className="mx-auto max-w-xl rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm text-stone-600">Dashboard module coming soon.</p>
      </section>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customer/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute>
            <CustomerProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contractor/dashboard"
        element={
          <ProtectedRoute>
            <RoleDashboardPlaceholder title="Contractor Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/dashboard"
        element={
          <ProtectedRoute>
            <RoleDashboardPlaceholder title="Worker Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/architect/dashboard"
        element={
          <ProtectedRoute>
            <RoleDashboardPlaceholder title="Architect Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleDashboardPlaceholder title="Admin Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
    </Routes>
  )
}

export default App
