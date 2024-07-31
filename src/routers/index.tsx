import { createBrowserRouter } from 'react-router-dom'
import LoginRoutes from './AuthenticationRoutes'
import MainRoutes from './MainRoutes'
// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([MainRoutes, LoginRoutes], {
  // basename: process.env.REACT_APP_BASE_ROUTER_NAME
  basename: ''
})

export default router
