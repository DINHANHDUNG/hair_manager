import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { authStore } from '../app/selectedStore'

const UnauthenticatedRoute = () => {
  const auth = useSelector(authStore)

  if (auth.accessToken) {
    return <Navigate to='/' />
  }

  return <Outlet />
}

export default UnauthenticatedRoute
