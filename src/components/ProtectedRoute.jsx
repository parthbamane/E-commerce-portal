import React from 'react'
import { useAuth } from '../providers/AuthProvider'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ allowed = [], children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (allowed.length && !allowed.includes(user.role)) return <div className="p-8">Access denied</div>
  return children
}
