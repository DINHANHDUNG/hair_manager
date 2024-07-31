import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// material-ui
import Collapse from '@mui/material/Collapse'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// project imports
import NavItem from '../NavItem'

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { useAppSelector } from '../../../../../../app/hooks'
import { customTheme } from '../../../../../../app/selectedStore'
import { MenuItem } from '../../../../../../types'

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }: { menu: MenuItem; level: number }) => {
  const theme = useTheme()
  const customization = useAppSelector(customTheme)

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string>('')

  const handleClick = () => {
    setOpen(!open)
    setSelected(!selected ? menu?.id : '')
    // if (menu?.id !== 'authentication' && menu?.children && menu?.children[0]?.url) {
    //   navigate(menu?.children[0]?.url)
    // }
  }

  const { pathname } = useLocation()
  const checkOpenForParent = (child: Array<MenuItem>, id: string) => {
    child?.forEach((item: MenuItem) => {
      if (item.url === pathname) {
        setOpen(true)
        setSelected(id)
      }
    })
  }

  // menu collapse for sub-levels
  useEffect(() => {
    setOpen(false)
    setSelected('')
    if (menu.children) {
      menu.children.forEach((item: MenuItem) => {
        if (item?.children && item?.children?.length > 0) {
          checkOpenForParent(item?.children, menu.id)
        }
        if (item.url === pathname) {
          setSelected(menu?.id)
          setOpen(true)
        }
      })
    }
  }, [pathname, menu.children])

  // menu collapse & item
  const menus = menu.children?.map((item: MenuItem) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />
      default:
        return (
          <Typography key={item.id} variant='h6' color='error' align='center'>
            Menu Items Error
          </Typography>
        )
    }
  })

  const Icon = menu.icon
  const menuIcon = Icon ? (
    <Icon strokeWidth={1.5} size='1.3rem' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: selected === menu.id ? 8 : 6,
        height: selected === menu.id ? 8 : 6
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  )

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: `${customization.borderRadius}px`,
          mb: 0.5,
          alignItems: 'flex-start',
          backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>{menuIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={selected === menu.id ? 'h5' : 'body1'} color='inherit' sx={{ my: 'auto' }}>
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography variant='caption' sx={{ ...theme.typography.subMenuCaption }} display='block' gutterBottom>
                {menu.caption}
              </Typography>
            )
          }
        />
        {open ? (
          <IconChevronUp stroke={1.5} size='1rem' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        ) : (
          <IconChevronDown stroke={1.5} size='1rem' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List
          component='div'
          disablePadding
          sx={{
            position: 'relative',
            '&:after': {
              content: "''",
              position: 'absolute',
              left: '32px',
              top: 0,
              height: '100%',
              width: '1px',
              opacity: 1,
              background: theme.palette.primary.light
            }
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  )
}

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number
}

export default NavCollapse
