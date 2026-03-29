import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

import Landing         from './pages/Landing'
import About           from './pages/About'
import LoginSelect     from './pages/LoginSelect'
import Auth            from './pages/Auth'
import EnrollWizard    from './pages/EnrollWizard/index'
import Profile         from './pages/Profile'
import ResponderHome   from './pages/Responder/ResponderHome'
import ScanInterface   from './pages/Responder/ScanInterface'
import PatientResult   from './pages/Responder/PatientResult'
import HCPPending      from './pages/HCPPending'
import AdminLogin      from './pages/Admin/AdminLogin'
import AdminRegister   from './pages/Admin/AdminRegister'
import AdminDashboard  from './pages/Admin/AdminDashboard'
import AdminUserDetail from './pages/Admin/AdminUserDetail'
import AdminTeam       from './pages/Admin/AdminTeam'
import Legal          from './pages/Legal'
import Solutions      from './pages/Solutions'
import NotFound        from './pages/NotFound'

// Requires login
function PrivateRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/login" replace />
}

// Redirect logged-in users away from auth pages
function PublicOnlyRoute({ children }) {
  const { currentUser, userProfile } = useAuth()
  if (!currentUser) return children
  if (userProfile?.accountType === 'admin') return <Navigate to="/admin" replace />
  if (userProfile?.accountType === 'responder') {
    return userProfile?.approvalStatus === 'approved'
      ? <Navigate to="/responder" replace />
      : <Navigate to="/hcp/pending" replace />
  }
  if (!userProfile?.enrollmentComplete) return <Navigate to="/enroll" replace />
  return <Navigate to="/profile" replace />
}

// Admin only
function AdminRoute({ children }) {
  const { currentUser, userProfile } = useAuth()
  if (!currentUser) return <Navigate to="/admin/login" replace />
  // Wait for Firestore profile to load before making routing decisions
  if (!userProfile) return (
    <div style={{ background: '#0D1A1A', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner spinner-teal" />
    </div>
  )
  if (userProfile.accountType !== 'admin') return <Navigate to="/" replace />
  return children
}

// HCP only (approved)
function HCPRoute({ children }) {
  const { currentUser, userProfile } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (userProfile?.accountType !== 'responder') return <Navigate to="/" replace />
  if (userProfile?.approvalStatus !== 'approved') return <Navigate to="/hcp/pending" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="/solutions" element={<Solutions />} />

      {/* Login selector + individual login pages */}
      <Route path="/login"              element={<PublicOnlyRoute><LoginSelect /></PublicOnlyRoute>} />
      <Route path="/login/patient"      element={<PublicOnlyRoute><Auth mode="login" /></PublicOnlyRoute>} />
      <Route path="/login/hcp"          element={<PublicOnlyRoute><Auth mode="login" accountHint="hcp" /></PublicOnlyRoute>} />
      <Route path="/register"           element={<PublicOnlyRoute><Auth mode="register" /></PublicOnlyRoute>} />
      <Route path="/responder/register" element={<PublicOnlyRoute><Auth mode="responder-register" /></PublicOnlyRoute>} />

      {/* Patient */}
      <Route path="/enroll"  element={<PrivateRoute><EnrollWizard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* HCP / Responder */}
      <Route path="/hcp/pending"                    element={<PrivateRoute><HCPPending /></PrivateRoute>} />
      <Route path="/responder"                      element={<HCPRoute><ResponderHome /></HCPRoute>} />
      <Route path="/responder/scan"                 element={<HCPRoute><ScanInterface /></HCPRoute>} />
      <Route path="/responder/result/:patientId"    element={<HCPRoute><PatientResult /></HCPRoute>} />

      {/* Admin */}
      <Route path="/admin/login"         element={<AdminLogin />} />
      <Route path="/admin/register"      element={<AdminRegister />} />
      <Route path="/admin"               element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/team"          element={<AdminRoute><AdminTeam /></AdminRoute>} />
      <Route path="/admin/users/:userId" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
