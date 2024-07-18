import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '../app/store'

const ProtectedRoute = ({ roles }: { roles: Array<string> }) => {
  const auth = useSelector((state: RootState) => state.auth)

  if (!auth.accessToken) {
    return <Navigate to='/login' />
  }

  if (roles && !roles.includes(auth.user?.role)) {
    return <Navigate to='/' />
  }

  return <Outlet />
}

export default ProtectedRoute
