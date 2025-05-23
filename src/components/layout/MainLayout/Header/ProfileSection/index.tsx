import { useEffect, useRef, useState } from 'react'

import { useNavigate } from 'react-router-dom'

// material-ui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports

// assets
import { IconLockAccess, IconLogout, IconSettings } from '@tabler/icons-react'
import { logout } from '../../../../../app/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks'
import { authStore, customTheme } from '../../../../../app/selectedStore'
import ChangePassword from '../../../../dialog/ChangePassword'
import MainCard from '../../../../ui-component/cards/MainCard'
import Transitions from '../../../../ui-component/extended/Transitions'
import ROUTES from '../../../../../routers/helpersRouter/constantRouter'

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme()
  const customization = useAppSelector(customTheme)
  const auth = useAppSelector(authStore).user
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // const [sdm, setSdm] = useState(true)
  // const [notification, setNotification] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [open, setOpen] = useState(false)
  const [openModalChangePass, setOpenModalChangePass] = useState(false)
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<HTMLDivElement>(null)
  const handleLogout = async () => {
    dispatch(logout())
  }

  const handleClose = (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return
    }
    setOpen(false)
  }

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number, route = '') => {
    setSelectedIndex(index)
    handleClose(event)

    if (index === 1) {
      setOpenModalChangePass(true)
    }

    if (route && route !== '') {
      navigate(route)
    }
  }
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={auth?.staff?.avatar}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup='true'
            color='inherit'
          />
        }
        label={<IconSettings stroke={1.5} size='1.5rem' color={theme.palette.primary.main} />}
        variant='outlined'
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}
        color='primary'
      />
      <Popper
        placement='bottom-end'
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack sx={{ mb: 1 }}>
                      <Stack direction='row' spacing={0.5} alignItems='center'>
                        <Typography variant='h4'>{auth?.staff?.name}</Typography>
                        <Typography variant='h4'>({auth?.role?.nameVI})</Typography>
                      </Stack>
                      <Typography component='span' variant='subtitle2' sx={{ fontWeight: 400 }}>
                        Tài khoản: {auth?.username}
                      </Typography>
                    </Stack>
                    {/* <OutlinedInput
                      sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                      id='input-search-profile'
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder='Search profile options'
                      startAdornment={
                        <InputAdornment position='start'>
                          <IconSearch stroke={1.5} size='1rem' color={theme.palette.grey[500]} />
                        </InputAdornment>
                      }
                      aria-describedby='search-helper-text'
                      inputProps={{
                        'aria-label': 'weight'
                      }}
                    /> */}
                    <Divider />
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2, pt: 0 }}>
                      {/* <Divider />
                      <Card
                        sx={{
                          bgcolor: theme.palette.primary.light,
                          my: 2
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={3} direction='column'>
                            <Grid item>
                              <Grid item container alignItems='center' justifyContent='space-between'>
                                <Grid item>
                                  <Typography variant='subtitle1'>Start DND Mode</Typography>
                                </Grid>
                                <Grid item>
                                  <Switch
                                    color='primary'
                                    checked={sdm}
                                    onChange={(e) => setSdm(e.target.checked)}
                                    name='sdm'
                                    size='small'
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Grid item container alignItems='center' justifyContent='space-between'>
                                <Grid item>
                                  <Typography variant='subtitle1'>Allow Notifications</Typography>
                                </Grid>
                                <Grid item>
                                  <Switch
                                    checked={notification}
                                    onChange={(e) => setNotification(e.target.checked)}
                                    name='sdm'
                                    size='small'
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <Divider /> */}
                      <List
                        component='nav'
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          // selected={selectedIndex === 0}
                          onClick={(event) =>
                            handleListItemClick(
                              event,
                              0,
                              `/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}/${auth.id}`
                            )
                          }
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size='1.3rem' />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant='body2'>Thông tin tài khoản</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          // selected={selectedIndex === 1}
                          onClick={(event) => handleListItemClick(event, 1, '#changepass')}
                        >
                          <ListItemIcon>
                            <IconLockAccess stroke={1.5} size='1.3rem' />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant='body2'>Đổi mật khẩu</Typography>} />
                        </ListItemButton>
                        {/* <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 1}
                          onClick={(event) => handleListItemClick(event, 1, '#')}
                        >
                          <ListItemIcon>
                            <IconUser stroke={1.5} size='1.3rem' />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Grid container spacing={1} justifyContent='space-between'>
                                <Grid item>
                                  <Typography variant='body2'>Social Profile</Typography>
                                </Grid>
                                <Grid item>
                                  <Chip
                                    label='02'
                                    size='small'
                                    sx={{
                                      bgcolor: theme.palette.warning.dark,
                                      color: theme.palette.background.default
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            }
                          />
                        </ListItemButton> */}
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size='1.3rem' />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant='body2'>Đăng xuất</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      <ChangePassword handleClose={() => setOpenModalChangePass(false)} open={openModalChangePass} />
    </>
  )
}

export default ProfileSection
