import { useEffect, useState } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

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
interface NavCollapseProps {
  menu: MenuItem
  level: number
}
// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse: React.FC<NavCollapseProps> = ({ menu, level }) => {
  const theme = useTheme()
  const customization = useAppSelector(customTheme)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string>('')

  const { pathname } = useLocation()

  const handleClick = () => {
    setOpen(!open)
    setSelected(selected === menu.id ? '' : menu.id)
  }

  useEffect(() => {
    setOpen(false)
    setSelected('')
    if (menu.children) {
      menu.children.forEach((item) => {
        if (item.url) {
          // Check if the URL is matched exactly or with dynamic parameter
          const exactMatch = matchPath({ path: item.url, end: true }, pathname)
          const dynamicMatch = matchPath(
            { path: item.url.replace(/\/\d+$/, ''), end: true },
            pathname.replace(/\/\d+$/, '')
          )

          if (item.children) {
            checkOpenForParent(item.children, menu.id)
          }

          if (exactMatch || dynamicMatch) {
            setSelected(menu.id)
            setOpen(true)
          }
        }
      })
    }
  }, [pathname, menu.children])

  const checkOpenForParent = (children: MenuItem[], id: string) => {
    children.forEach((item) => {
      if (item.url) {
        // Check if the URL is matched exactly or with dynamic parameter
        const exactMatch = matchPath({ path: item.url, end: true }, pathname)
        const dynamicMatch = matchPath(
          { path: item.url.replace(/\/:[^/]+/, ''), end: true },
          pathname.replace(/\/:[^/]+/, '')
        )
        if (exactMatch || dynamicMatch) {
          setOpen(true)
          setSelected(id)
        } else if (item.children) {
          checkOpenForParent(item.children, id)
        }
      }
    })
  }

  const menus = menu.children?.map((item) => {
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
        aria-expanded={open}
        aria-controls={`collapse-${menu.id}`}
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

export default NavCollapse
