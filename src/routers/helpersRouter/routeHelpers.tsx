import { ReactNode } from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'
import PrivateRoute from '../../components/PrivateRoute'

// Định nghĩa một kiểu dữ liệu cho createProtectedRoute
type CreateProtectedRouteType = (element: ReactNode, allowedRoles: string[]) => JSX.Element

// Hàm createProtectedRoute nhận element và allowedRoles, trả về JSX.Element
export const createProtectedRoute: CreateProtectedRouteType = (element, allowedRoles) => {
  return (
    <PrivateRoute>
      <ProtectedRoute roles={allowedRoles} element={element} />
    </PrivateRoute>
  )
}

// Với createPrivateRoute, đơn giản chỉ cần nhúng element vào PrivateRoute
export const createPrivateRoute = (element: ReactNode) => <PrivateRoute>{element}</PrivateRoute>
