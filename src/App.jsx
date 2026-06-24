import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'

import LoginPage from './pages/auth/LoginPage/LoginPage'
import MfaPage from './pages/auth/MfaPage/MfaPage'
import ConsentPage from './pages/auth/ConsentPage/ConsentPage'
import BranchDashboard from './pages/branch/BranchDashboard/BranchDashboard'
import DataEntry from './pages/branch/DataEntry/DataEntry'
import BranchReports from './pages/branch/BranchReports/BranchReports'
import RegionalDashboard from './pages/regional/RegionalDashboard/RegionalDashboard'
import HODashboard from './pages/ho/HODashboard/HODashboard'
import HOAnalytics from './pages/ho/HOAnalytics/HOAnalytics'

function ProtectedRoute({ children, roles }) {
  const { user, mfaVerified, consentGiven } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!mfaVerified) return <Navigate to="/mfa" replace />
  if (user.role === 'branch' && !consentGiven) return <Navigate to="/consent" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mfa" element={<MfaPage />} />
      <Route path="/consent" element={<ConsentPage />} />
      <Route path="/branch/dashboard" element={
        <ProtectedRoute roles={['branch']}><BranchDashboard /></ProtectedRoute>
      } />
      <Route path="/branch/data-entry" element={
        <ProtectedRoute roles={['branch']}><DataEntry /></ProtectedRoute>
      } />
      <Route path="/branch/reports" element={
        <ProtectedRoute roles={['branch']}><BranchReports /></ProtectedRoute>
      } />
      <Route path="/regional/dashboard" element={
        <ProtectedRoute roles={['regional']}><RegionalDashboard /></ProtectedRoute>
      } />
      <Route path="/ho/dashboard" element={
        <ProtectedRoute roles={['ho']}><HODashboard /></ProtectedRoute>
      } />
      <Route path="/ho/analytics" element={
        <ProtectedRoute roles={['ho']}><HOAnalytics /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

// Strip the trailing slash from Vite's BASE_URL ('/' or '/<repo-name>/') so the
// router resolves correctly whether served from root or a GitHub Pages sub-path.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
