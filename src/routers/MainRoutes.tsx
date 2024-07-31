import { lazy } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Loadable from '../components/ui-component/Loadable'
import ROUTES from './helpersRouter/constantRouter'
import { createPrivateRoute, createProtectedRoute } from './helpersRouter/routeHelpers'
import { PERMISSION } from '../constants'

// project imports

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../page/admin/AdminPage')))

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../page/utilities/Typography')))
const UtilsColor = Loadable(lazy(() => import('../page/utilities/Color')))
const UtilsShadow = Loadable(lazy(() => import('../page/utilities/Shadow')))
const UtilsInput = Loadable(lazy(() => import('../page/utilities/Input')))
const SamplePage = Loadable(lazy(() => import('../page/home/HomePage')))
const StaffPage = Loadable(lazy(() => import('../page/category/staff')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: ROUTES.HOME,
  element: createPrivateRoute(<MainLayout />),
  children: [
    {
      path: ROUTES.HOME,
      element: createProtectedRoute(<DashboardDefault />, [PERMISSION.ADMIN, PERMISSION.OP])
    },
    {
      path: ROUTES.DASHBOARD,
      children: [
        {
          path: ROUTES.DEFAULT,
          element: createProtectedRoute(<DashboardDefault />, [PERMISSION.ADMIN])
        }
      ]
    },
    {
      path: ROUTES.UTILS,
      children: [
        {
          path: ROUTES.UTILS_CHILD.TYPOGRAPHY,
          element: createProtectedRoute(<UtilsTypography />, [PERMISSION.ADMIN])
        },
        {
          path: ROUTES.UTILS_CHILD.SHADOW,
          element: createProtectedRoute(<UtilsShadow />, [PERMISSION.ADMIN])
        },
        {
          path: ROUTES.UTILS_CHILD.COLOR,
          element: createProtectedRoute(<UtilsColor />, [PERMISSION.ADMIN])
        },
        {
          path: ROUTES.UTILS_CHILD.INPUT,
          element: createProtectedRoute(<UtilsInput />, [PERMISSION.ADMIN])
        }
      ]
    },
    {
      path: ROUTES.CATEGORY,
      children: [
        {
          path: ROUTES.CATEGORY_CHILD.STAFF,
          element: createProtectedRoute(<StaffPage />, [PERMISSION.ADMIN])
        }
      ]
    },
    {
      path: ROUTES.SAMPLE_PAGE,
      element: <SamplePage />
    }
  ]
}

export default MainRoutes
