// material-ui
import Drawer from '@mui/material/Drawer'
import Grid from '@mui/material/Grid'
// import { useTheme } from '@mui/material/styles'
// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
// assets
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined'
import { IconButton, Typography, useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import SubCard from '../../../components/ui-component/cards/SubCard'
import Avatar from '../../../components/ui-component/extended/Avatar'
import { gridSpacing } from '../../../constants'
import ROUTES from '../../../routers/helpersRouter/constantRouter'
import { StaffType } from '../../../types/staff'

interface Props {
  isVisible: boolean
  changeVisible: () => void
  staff: StaffType
}

const DetailStaffDrawer = (Props: Props) => {
  const navigate = useNavigate()
  const { isVisible, changeVisible, staff } = Props

  const theme = useTheme()
  const matchUpMd = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <>
      <Drawer
        anchor='right'
        onClose={changeVisible}
        open={isVisible}
        PaperProps={{
          sx: {
            width: !matchUpMd ? '85%' : 400
          }
        }}
      >
        <PerfectScrollbar component='div'>
          <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
            <Grid item xs={12}>
              <SubCard
                title={
                  <Grid
                    item
                    xs={12}
                    container
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    flexDirection={'row'}
                  >
                    <Typography variant='h5'>Thông tin chung</Typography>
                    <IconButton
                      color='inherit'
                      size='small'
                      onClick={() => navigate(`/${ROUTES.CATEGORY}/${ROUTES.CATEGORY_CHILD.STAFF}/${staff.id}`)}
                    >
                      <DriveFileRenameOutlineOutlinedIcon fontSize='inherit' />
                    </IconButton>
                  </Grid>
                }
              >
                <Grid item xs={12} container alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                  <Avatar size='xl' alt={staff?.name} src={staff?.avatar} sx={{ mb: 2 }} />
                  <Typography variant='h3' sx={{ mb: 1 }}>
                    {staff?.name}
                  </Typography>
                  {/* <Typography variant='body1' textAlign={'center'}>
                    Hello,I’m Anshan Handgun Creative Graphic Designer & User Experience Designer based in Website, I
                    create digital Products a more Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus at.
                  </Typography> */}
                </Grid>
              </SubCard>
            </Grid>
            <Grid item xs={12}>
              <SubCard title='Thông tin cá nhân'>
                <Grid container item xs={12} spacing={gridSpacing}>
                  <Grid item xs={6} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5' fontWeight={'700'}>
                      Họ tên
                    </Typography>
                    <Typography variant='caption'>{staff?.name}</Typography>
                  </Grid>
                  <Grid item xs={6} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5'>Năm sinh</Typography>
                    <Typography variant='caption'>
                      {staff?.birthDay ? moment(staff?.birthDay).format('DD/MM/YYYY') : ''}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5'>Giới tính</Typography>
                    <Typography variant='caption'>{staff?.gender}</Typography>
                  </Grid>
                  <Grid item xs={6} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5'>Số điện thoại</Typography>
                    <Typography variant='caption'>{staff?.phoneNumber}</Typography>
                  </Grid>
                  <Grid item xs={12} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5'>Email</Typography>
                    <Typography variant='caption'>{staff?.email}</Typography>
                  </Grid>
                  <Grid item xs={12} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5'>Địa chỉ</Typography>
                    <Typography variant='caption'>{staff?.address}</Typography>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
            <Grid item xs={12}>
              <SubCard title='Người đại diện'>
                <Grid container item xs={12} spacing={gridSpacing}>
                  <Grid item xs={6} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5' fontWeight={'700'}>
                      Họ tên
                    </Typography>
                    <Typography variant='caption'>{staff?.representativeName}</Typography>
                  </Grid>
                  <Grid item xs={6} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5'>Chức vụ</Typography>
                    <Typography variant='caption'>{staff?.representativePosition}</Typography>
                  </Grid>
                  <Grid item xs={6} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5'>Số điện thoại</Typography>
                    <Typography variant='caption'>{staff?.representativePhone}</Typography>
                  </Grid>
                  {/* <Grid item xs={6} alignItems={'center'} justifyContent={'start'} flexDirection={'column'}>
                    <Typography variant='h5'>Năm sinh</Typography>
                    <Typography variant='caption'>03/01/1976</Typography>
                  </Grid> */}
                </Grid>
              </SubCard>
            </Grid>
          </Grid>
        </PerfectScrollbar>
      </Drawer>
    </>
  )
}

export default DetailStaffDrawer
