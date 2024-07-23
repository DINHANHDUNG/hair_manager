import { createBrowserRouter } from 'react-router-dom'
import LoginRoutes from './AuthenticationRoutes'
import MainRoutes from './MainRoutes'
// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([MainRoutes, LoginRoutes], {
  basename: process.env.BASE_ROUTER_NAME
})

export default router
