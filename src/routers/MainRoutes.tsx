import { lazy } from 'react'
import MainLayout from '../components/layout/MainLayout'
import Loadable from '../components/ui-component/Loadable'
import ROUTES from './helpersRouter/constantRouter'
import { createPrivateRoute, createProtectedRoute } from './helpersRouter/routeHelpers'
import { PERMISSION } from '../constants'
import NotAuthorizedPage from '../page/notAuthor/NotAuthorizedPage'
import {
  Perm_Customer_View,
  Perm_DASHBOARD_ORDER_SALE_View,
  Perm_DASHBOARD_ORDER_View,
  Perm_Order_View,
  Perm_Staff_View
} from '../help/permission'

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../page/dashboard/DashboardPage')))
const DashboarOrderdDefault = Loadable(lazy(() => import('../page/report')))
const DashboarOrderdSale = Loadable(lazy(() => import('../page/report/reportSale')))

// admin routing
// const AdminPage = Loadable(lazy(() => import('../page/admin/AdminPage')))

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../page/utilities/Typography')))
const UtilsColor = Loadable(lazy(() => import('../page/utilities/Color')))
const UtilsShadow = Loadable(lazy(() => import('../page/utilities/Shadow')))
const UtilsInput = Loadable(lazy(() => import('../page/utilities/Input')))
const SamplePage = Loadable(lazy(() => import('../page/home/HomePage')))
const StaffPage = Loadable(lazy(() => import('../page/category/staff')))
const StaffDetailPage = Loadable(lazy(() => import('../page/category/staff/detail')))
// const CustomerPage = Loadable(lazy(() => import('../page/category/customer')))
const CompanyPage = Loadable(lazy(() => import('../page/category/company')))
const WorkerPage = Loadable(lazy(() => import('../page/category/worker')))
const WorkerDetailPage = Loadable(lazy(() => import('../page/category/worker/detail')))
const AccountPage = Loadable(lazy(() => import('../page/category/account')))
const CustomerPage = Loadable(lazy(() => import('../page/category/customer')))

//Salary
const SalaryAdvancePage = Loadable(lazy(() => import('../page/category/salary/salary_advance')))
const SalaryRefundPage = Loadable(lazy(() => import('../page/category/salary/salary_refund')))
const SalaryPayPage = Loadable(lazy(() => import('../page/category/salary/salary-pay')))
const SalaryPayEmployeePage = Loadable(lazy(() => import('../page/category/salary/salary-pay/salaryPayEmployee')))

//Order
const OrderPage = Loadable(lazy(() => import('../page/order')))
// const FormAddEditOrder = Loadable(lazy(() => import('../page/order/addNew')))
const RequestEditOrderPage = Loadable(lazy(() => import('../page/requestEditOrder')))
const CancelOrderPage = Loadable(lazy(() => import('../page/listCancelOrder')))

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
        },
        {
          path: ROUTES.DASHBOARD_ORDER,
          element: createProtectedRoute(<DashboarOrderdDefault />, Perm_DASHBOARD_ORDER_View)
        },
        {
          path: ROUTES.DASHBOARD_ORDER_SALE,
          element: createProtectedRoute(<DashboarOrderdSale />, Perm_DASHBOARD_ORDER_SALE_View)
        }
      ]
    },
    {
      path: ROUTES.ORDER,
      children: [
        {
          path: ROUTES.DEFAULT,
          // element: <OrderPage />,
          element: createProtectedRoute(<OrderPage />, Perm_Order_View)
        },
        // {
        //   path: ROUTES.ORDER_ADD,
        //   element: <FormAddEditOrder />
        // },
        {
          path: ROUTES.ORDER_REQUEST,
          element: <RequestEditOrderPage />
        },
        {
          path: ROUTES.ORDER_CANCEL,
          element: <CancelOrderPage />
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
          element: createProtectedRoute(<StaffPage />, Perm_Staff_View)
        },
        {
          path: ROUTES.CATEGORY_CHILD.STAFF_DETAIL,
          // element: <StaffDetailPage />,
          element: createProtectedRoute(<StaffDetailPage />, Perm_Staff_View)
        },
        {
          path: ROUTES.CATEGORY_CHILD.PARTER,
          element: createProtectedRoute(<CustomerPage />, Perm_Staff_View)
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
        },
        {
          path: ROUTES.CATEGORY_CHILD.SALARY_ADVANCE,
          // element: <SalaryAdvancePage />
          element: createProtectedRoute(<SalaryAdvancePage />, [PERMISSION.ADMIN, PERMISSION.KETOAN, PERMISSION.SALE])
        },
        {
          path: ROUTES.CATEGORY_CHILD.SALARY_REFUND,
          // element: <SalaryRefundPage />,
          element: createProtectedRoute(<SalaryRefundPage />, [PERMISSION.ADMIN, PERMISSION.KETOAN])
        },
        {
          path: ROUTES.CATEGORY_CHILD.SALARY_PAY_STAFF,
          // element: <SalaryPayPage type='STAFF' />,
          element: createProtectedRoute(<SalaryPayPage type='STAFF' />, [PERMISSION.ADMIN, PERMISSION.KETOAN])
        },
        {
          path: ROUTES.CATEGORY_CHILD.SALARY_PAY_EMPLOYEE,
          // element: <SalaryPayEmployeePage type='EMPLOYEE' />,
          element: createProtectedRoute(<SalaryPayEmployeePage type='EMPLOYEE' />, [
            PERMISSION.ADMIN,

            PERMISSION.KETOAN
          ])
        },
        {
          path: ROUTES.CATEGORY_CHILD.ACCOUNT_MANAGER,
          element: createProtectedRoute(<AccountPage />, [PERMISSION.ADMIN, PERMISSION.KETOAN])
        },
        {
          path: ROUTES.CATEGORY_CHILD.CUSTOMER_MANAGER,
          element: createProtectedRoute(<CustomerPage />, Perm_Customer_View)
        }
      ]
    },
    {
      path: ROUTES.SAMPLE_PAGE,
      element: createProtectedRoute(<SamplePage />, [PERMISSION.SALE])
    },
    {
      path: ROUTES.NOT_AUTHORIZED,
      element: <NotAuthorizedPage />
    }
  ]
}

export default MainRoutes
