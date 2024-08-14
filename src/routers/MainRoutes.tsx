import { lazy } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Loadable from '../components/ui-component/Loadable'
import ROUTES from './helpersRouter/constantRouter'
import { createPrivateRoute, createProtectedRoute } from './helpersRouter/routeHelpers'
import { PERMISSION } from '../constants'
import NotAuthorizedPage from '../page/notAuthor/NotAuthorizedPage'

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../page/dashboard/DashboardPage')))

// admin routing
const AdminPage = Loadable(lazy(() => import('../page/admin/AdminPage')))

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../page/utilities/Typography')))
const UtilsColor = Loadable(lazy(() => import('../page/utilities/Color')))
const UtilsShadow = Loadable(lazy(() => import('../page/utilities/Shadow')))
const UtilsInput = Loadable(lazy(() => import('../page/utilities/Input')))
const SamplePage = Loadable(lazy(() => import('../page/home/HomePage')))
const StaffPage = Loadable(lazy(() => import('../page/category/staff')))
const StaffDetailPage = Loadable(lazy(() => import('../page/category/staff/detail')))
const PartnerPage = Loadable(lazy(() => import('../page/category/partner')))
const CompanyPage = Loadable(lazy(() => import('../page/category/company')))
const WorkerPage = Loadable(lazy(() => import('../page/category/worker')))
const WorkerDetailPage = Loadable(lazy(() => import('../page/category/worker/detail')))

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: ROUTES.HOME,
  element: createPrivateRoute(<MainLayout />),
  children: [
    {
      path: ROUTES.DASHBOARD,
      children: [
        {
          path: ROUTES.INDEX,
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: ROUTES.ORDER,
      children: [
        {
          path: ROUTES.DEFAULT,
          element: <AdminPage />
        },
        {
          path: ROUTES.ORDER_DETAIL,
          element: <StaffPage />
        }
      ]
    },
    {
      path: ROUTES.UTILS,
      children: [
        {
          path: ROUTES.UTILS_CHILD.TYPOGRAPHY,
          element: <UtilsTypography />
        },
        {
          path: ROUTES.UTILS_CHILD.SHADOW,
          element: <UtilsShadow />
        },
        {
          path: ROUTES.UTILS_CHILD.COLOR,
          element: <UtilsColor />
        },
        {
          path: ROUTES.UTILS_CHILD.INPUT,
          element: <UtilsInput />
        }
      ]
    },
    {
      path: ROUTES.CATEGORY,
      children: [
        {
          path: ROUTES.CATEGORY_CHILD.STAFF,
          element: <StaffPage />
        },
        {
          path: ROUTES.CATEGORY_CHILD.STAFF_DETAIL,
          element: <StaffDetailPage />
        },
        {
          path: ROUTES.CATEGORY_CHILD.PARTER,
          element: <PartnerPage />
        },
        {
          path: ROUTES.CATEGORY_CHILD.COMPANY,
          element: <CompanyPage />
        },
        {
          path: ROUTES.CATEGORY_CHILD.WORKER,
          element: <WorkerPage />
        },
        {
          path: ROUTES.CATEGORY_CHILD.WORKER_DETAIL,
          element: <WorkerDetailPage />
        }
      ]
    },
    {
      path: ROUTES.SAMPLE_PAGE,
      element: createProtectedRoute(<SamplePage />, [PERMISSION.DATABASE])
    },
    {
      path: ROUTES.NOT_AUTHORIZED,
      element: <NotAuthorizedPage />
    }
  ]
}

export default MainRoutes
