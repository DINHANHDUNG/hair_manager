import { forwardRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, matchPath, useLocation } from 'react-router-dom'

// material-ui
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { menuOpen, setMenu } from '../../../../../../app/features/customization/customizationSlice'
import { useAppSelector } from '../../../../../../app/hooks'
import { customTheme } from '../../../../../../app/selectedStore'
import { MenuItem } from '../../../../../../types'

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

type ListItemProps = {
  component: React.ElementType
} & Omit<React.ComponentProps<typeof ListItemButton>, 'component'>

const NavItem = ({ item, level }: { item: MenuItem; level: number }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const customization = useAppSelector(customTheme)
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))

  const Icon = item.icon
  const itemIcon = Icon ? (
    <Icon stroke={1.5} size='1.3rem' />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: customization?.isOpen?.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
        height: customization?.isOpen?.findIndex((id) => id === item?.id) > -1 ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  )

  let itemTarget = '_self'
  if (item.target) {
    itemTarget = '_blank'
  }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const listItemProps: ListItemProps = {
    component: forwardRef((props: any, ref: any) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />)
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  // if (item?.external) {
  //   listItemProps = { component: 'a', href: item.url, target: itemTarget }
  // }

  const itemHandler = (id: string) => {
    dispatch(menuOpen({ id }))
    if (matchesSM) dispatch(setMenu({ opened: false }))
  }

  // active menu item on page load
  useEffect(() => {
    if (item.url && matchPath(item.url, pathname)) {
      dispatch(menuOpen({ id: item.id }))
    }
  }, [pathname, item.url, dispatch, item.id])

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`
      }}
      selected={customization?.isOpen?.findIndex((id) => id === item.id) > -1}
      onClick={() => itemHandler(item?.id)}
    >
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={customization?.isOpen?.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'}
            color='inherit'
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant='caption' sx={{ ...theme.typography.subMenuCaption }} display='block' gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  )
}

// NavItem.propTypes = {
//   item: PropTypes.object,
//   level: PropTypes.number
// }

export default NavItem
