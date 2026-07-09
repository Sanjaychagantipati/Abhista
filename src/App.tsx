import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { LoginPage } from './pages/auth/LoginPage'
import { CustomerDashboard } from './pages/customer/CustomerDashboard'
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage'
import { RequirementCreatePage } from './pages/customer/RequirementCreatePage'
import { RequirementsListPage } from './pages/customer/RequirementsListPage'
import { RequirementDetailsPage } from './pages/customer/RequirementDetailsPage'
import { ContractorDashboard } from './pages/contractor/ContractorDashboard'
import { ContractorProfilePage } from './pages/contractor/ContractorProfilePage'
import { PortfolioListPage } from './pages/contractor/PortfolioListPage'
import { PortfolioCreatePage } from './pages/contractor/PortfolioCreatePage'
import { LeadsListPage } from './pages/contractor/LeadsListPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { useAuth } from './hooks/auth/useAuth'
import { getDashboardPathForRole } from './services/auth/authRedirect'
import { PublicMarketplace } from './pages/PublicMarketplace'
import { BookServicePage } from './pages/customer/BookServicePage'
import { RequestCallbackPage } from './pages/RequestCallbackPage'

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

function RootRedirect() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getDashboardPathForRole(user.role)} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicMarketplace />} />
      <Route path="/request-callback" element={<RequestCallbackPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/book-service"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <BookServicePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <CustomerProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/requirements/create"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <RequirementCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/requirements"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <RequirementsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/requirements/:id"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
            <RequirementDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contractor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_CONTRACTOR']}>
            <ContractorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contractor/profile"
        element={
          <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_CONTRACTOR']}>
            <ContractorProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contractor/portfolio"
        element={
          <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_CONTRACTOR']}>
            <PortfolioListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contractor/portfolio/create"
        element={
          <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_CONTRACTOR']}>
            <PortfolioCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contractor/leads"
        element={
          <ProtectedRoute allowedRoles={['ROLE_PROVIDER', 'ROLE_CONTRACTOR']}>
            <LeadsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/worker/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_WORKER']}>
            <RoleDashboardPlaceholder title="Worker Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/architect/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ARCHITECT']}>
            <RoleDashboardPlaceholder title="Architect Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <RoleDashboardPlaceholder title="Admin Dashboard" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default App
