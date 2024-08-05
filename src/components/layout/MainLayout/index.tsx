import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'

// material-ui
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
// project imports
import { CssBaseline, styled, Theme, useTheme } from '@mui/material'
import Header from './Header'
import Sidebar from './Sidebar'

// assets
import { IconChevronRight } from '@tabler/icons-react'
import { setMenu } from '../../../app/features/customization/customizationSlice'
import { useAppSelector } from '../../../app/hooks'
import { customTheme } from '../../../app/selectedStore'
import { drawerWidth } from '../../../constants'
import menuItems from '../../menu-items'
import Breadcrumbs from '../../ui-component/extended/Breadcrumbs'
import Customization from '../customization'
import { useGetAccountQuery } from '../../../app/services/auth'
import LoadingModal from '../../ui-component/LoadingModal'

// Define the type for the props used in Main styled component
interface MainProps {
  theme: Theme
  open: boolean
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'theme' })<MainProps>(
  ({ theme, open }) => ({
    ...theme.typography.mainContent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    transition: theme.transitions.create(
      'margin',
      open
        ? {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
          }
        : {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          }
    ),
    [theme.breakpoints.up('md')]: {
      marginLeft: open ? 0 : -(drawerWidth - 20),
      width: `calc(100% - ${drawerWidth}px)`
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px'
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: '10px',
      width: `calc(100% - ${drawerWidth}px)`,
      padding: '16px',
      marginRight: '10px'
    }
  })
)

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const { isLoading } = useGetAccountQuery({})

  const theme = useTheme()
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'))
  // Handle left drawer
  const leftDrawerOpened = useAppSelector(customTheme).opened
  const dispatch = useDispatch()
  const handleLeftDrawerToggle = () => {
    dispatch(setMenu({ opened: !leftDrawerOpened }))
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position='fixed'
        color='inherit'
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}
        <Breadcrumbs separator={IconChevronRight} navigation={menuItems} icon title rightAlign />
        <Outlet />
      </Main>
      <Customization />
      <LoadingModal open={isLoading} />
    </Box>
  )
}

export default MainLayout
