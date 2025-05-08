// material-ui
import { Typography } from '@mui/material'

// project imports
import NavGroup from './NavGroup'
import menuItems from '../../../../menu-items'
import { authStore } from '../../../../../app/selectedStore'
import { useAppSelector } from '../../../../../app/hooks'
import { MenuItem } from '../../../../../types'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const role = useAppSelector(authStore)?.user?.role

  const navItems = menuItems().map((item: MenuItem) => {
    if (item?.premissions?.some((e) => role === e)) {
      switch (item?.type) {
        case 'group':
          return <NavGroup key={item?.id} item={item} />
        default:
          return (
            <Typography key={item?.id} variant='h6' color='error' align='center'>
              Menu Items Error
            </Typography>
          )
      }
    }
    return ''
  })

  return <>{navItems}</>
}

export default MenuList
