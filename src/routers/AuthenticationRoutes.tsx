import { lazy } from 'react'

// project imports
import Loadable from '../components/ui-component/Loadable'
import AuthLayout from '../components/layout/auth-layout/index'

// login routing
const AuthLogin = Loadable(lazy(() => import('../page/login/Login')))
// const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      path: '/pages/login/login3',
      element: <AuthLogin />
    }
    // {
    //   path: '/pages/register/register3',
    //   element: <AuthRegister3 />
    // }
  ]
}

export default AuthenticationRoutes
