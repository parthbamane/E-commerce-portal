import React from 'react'
import { Navigate } from 'react-router-dom'
import { getSession } from './auth'


export default function RoleGuard({ children, allowed = [] }) {
const s = getSession()
if (!s) return <Navigate to="/login" replace />
if (allowed.length > 0 && !allowed.includes(s.role)) {
return <div className="p-8">Access denied — insufficient role</div>
}
return children
}