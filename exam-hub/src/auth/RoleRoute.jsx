import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth.js'

export default function RoleRoute({ role }) {
  const { user } = useAuth()

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
  }

  return <Outlet />
}