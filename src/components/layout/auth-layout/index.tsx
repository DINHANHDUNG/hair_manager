import { Outlet } from 'react-router-dom'
import Customization from '../customization'

// project imports

// ==============================|| MINIMAL LAYOUT ||============================== //

const AuthLayout = () => (
  <>
    <Outlet />
    <Customization />
  </>
)

export default AuthLayout
