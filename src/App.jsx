import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import MerchantOnboarding from './pages/MerchantOnboarding'
import OrderTracking from './pages/OrderTracking'
import Reconciliation from './pages/Reconciliation'
import Tickets from './pages/Tickets'
import AdminPanel from './pages/AdminPanel'
import Dashboard from './pages/Dashboard'     
import { useAuth } from './providers/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Login Page */}
      <Route path="/login" element={<Login />} />

      {/* Authenticated Area */}
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />} >

        {/*Dashboard */}
        <Route
          index
          element={
            <ProtectedRoute allowed={['agent', 'manager', 'admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Merchants */}
        <Route
          path="merchants"
          element={
            <ProtectedRoute allowed={['agent','manager','admin']}>
              <MerchantOnboarding />
            </ProtectedRoute>
          }
        />

        {/* Orders */}
        <Route
          path="orders"
          element={
            <ProtectedRoute allowed={['agent','manager','admin']}>
              <OrderTracking />
            </ProtectedRoute>
          }
        />

        {/* Reconciliation (manager/admin only) */}
        <Route
          path="reconciliation"
          element={
            <ProtectedRoute allowed={['manager','admin']}>
              <Reconciliation />
            </ProtectedRoute>
          }
        />

        {/* Tickets */}
        <Route
          path="tickets"
          element={
            <ProtectedRoute allowed={['agent','manager','admin']}>
              <Tickets />
            </ProtectedRoute>
          }
        />

        {/* Admin Panel */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowed={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

      </Route>
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  )
}
