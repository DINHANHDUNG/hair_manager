import PropTypes from 'prop-types'

// material-ui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import { useTheme } from '@mui/material/styles'

// project imports
import LogoSection from '../LogoSection'
import ProfileSection from './ProfileSection'

// assets
import { Typography } from '@mui/material'
import { IconMenu2 } from '@tabler/icons-react'
import NotificationSection from './NotificationSection'

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }: { handleLeftDrawerToggle: () => void }) => {
  const theme = useTheme()

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component='span' sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <Avatar
            variant='rounded'
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color='inherit'
          >
            <IconMenu2 stroke={1.5} size='1.3rem' />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box component='span' sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1, ml: 4 }}>
        <Typography variant='h3' sx={{ textTransform: 'uppercase' }}>
          Quản lý tóc
        </Typography>
        <Typography variant='caption'>
          Số nhà 70 Thị Trấn Chờ, Yên Phong - Bắc Ninh.
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <NotificationSection />
      <ProfileSection />
    </>
  )
}

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
}

export default Header
