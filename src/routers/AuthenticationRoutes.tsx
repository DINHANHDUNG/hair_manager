import { lazy } from 'react'

// project imports
import Loadable from '../components/ui-component/Loadable'
import AuthLayout from '../components/layout/auth-layout/index'
import ROUTES from './helpersRouter/constantRouter'

// login routing
const AuthLogin = Loadable(lazy(() => import('../page/login/Login')))
// const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication3/Register3')));
const NotAuthorizedPage = Loadable(lazy(() => import('../page/notAuthor/NotAuthorizedPage')))
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: ROUTES.HOME,
  element: <AuthLayout />,
  children: [
    {
      path: ROUTES.LOGIN,
      element: <AuthLogin />
    },
    {
      path: ROUTES.NOT_AUTHORIZED,
      element: <NotAuthorizedPage />
    }
  ]
}

export default AuthenticationRoutes
