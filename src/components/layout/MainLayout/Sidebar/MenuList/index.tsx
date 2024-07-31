// material-ui
import { Typography } from '@mui/material'

// project imports
import NavGroup from './NavGroup'
import menuItems from '../../../../menu-items'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const navItems = menuItems().map((item) => {
    switch (item?.type) {
      case 'group':
        //Check quyền trước
        return <NavGroup key={item?.id} item={item} />
      default:
        return (
          <Typography key={item?.id} variant='h6' color='error' align='center'>
            Menu Items Error
          </Typography>
        )
    }
  })

  return <>{navItems}</>
}

export default MenuList
