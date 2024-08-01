import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { authStore } from '../app/selectedStore'
import { ReactNode } from 'react'
import ROUTES from '../routers/helpersRouter/constantRouter'

interface ProtectedRouteProps {
  roles: string[]
  element: ReactNode
}

const ProtectedRoute = ({ roles, element }: ProtectedRouteProps) => {
  const auth = useSelector(authStore)

  if (!auth.accessToken) {
    // Nếu không có accessToken, chuyển hướng tới trang đăng nhập
    return <Navigate to={ROUTES.LOGIN} />
  }

  if (!roles.some((e) => auth?.user?.roles?.includes(e))) {
    // Nếu người dùng không có vai trò được yêu cầu, chuyển hướng tới trang không được phép
    return <Navigate to={`/${ROUTES.NOT_AUTHORIZED}`} />
  }

  return <>{element}</>
}

export default ProtectedRoute
