import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { authStore } from '../app/selectedStore'
import ROUTES from '../routers/helpersRouter/constantRouter'

interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = useAppSelector(authStore).accessToken

  if (!isAuthenticated) {
    // Có thể bổ sung phần xử lý lỗi hoặc thông báo tại đây nếu cần thiết
    return <Navigate to={ROUTES.LOGIN} />
  }

  return <>{children}</>
}

export default PrivateRoute
