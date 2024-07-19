import { createBrowserRouter } from 'react-router-dom'
import LoginRoutes from './AuthenticationRoutes'
// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([LoginRoutes], {
  basename: process.env.BASE_ROUTER_NAME
})

export default router
