import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Grid, IconButton, Tab, Tabs, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetStaffByIdQuery } from '../../../../app/services/staff'
import MyButton from '../../../../components/button/MyButton'
import MainCard from '../../../../components/ui-component/cards/MainCard'
import SubCard from '../../../../components/ui-component/cards/SubCard'
import Avatar from '../../../../components/ui-component/extended/Avatar'
import { gridSpacing } from '../../../../constants'
import { StaffType } from '../../../../types/staff'
import TabAlertLevels from './TabAlertLevels'
import TabChangePassword from './TabChangePassword'
import TabInfoStaff from './TabInfo'
import TabKPI from './TabKPI'
import TabSalary from './TabSalary'
import TabWorkProgress from './TabWorkProgress'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const StaffDetailPage = () => {
  const params = useParams()
  const staffId = params?.id ? Number(params?.id) : null

  const { data: fetchStaff, refetch } = useGetStaffByIdQuery(
    {
      staffId: staffId || 0
    },
    {
      skip: !staffId
    }
  )
  const dataStaff = fetchStaff?.data || ({} as StaffType)

  const { enqueueSnackbar } = useSnackbar()
  const [tab, setTab] = useState(0)

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('Selected file:', file)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    enqueueSnackbar('Copy thành công', {
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'right' }
    })
  }
  return (
    <>
      <MainCard back title={'Thông tin chi tiết nhân viên'} sx={{ height: '100%' }}>
        <Grid container spacing={gridSpacing} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <SubCard title='Ảnh đại diện'>
              <Grid item xs={12} container alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                <MyButton component='label' role={undefined} variant='text' tabIndex={-1} sx={{ border: 'none' }}>
                  <Avatar alt='John Doe' src={dataStaff.avatar} sx={{ mb: 2 }} />
                  <VisuallyHiddenInput type='file' onChange={handleFileChange} />
                </MyButton>
                <Typography variant='caption' sx={{ mb: 2 }}>
                  Nhấn vào ảnh để thay đổi
                </Typography>
                {/* <MyButton
                  component='label'
                  role={undefined}
                  variant='contained'
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{ backgroundColor: COLORS.bgButton }}
                >
                  Cập nhật
                  <VisuallyHiddenInput type='file' onChange={handleFileChange} />
                </MyButton> */}
              </Grid>
            </SubCard>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <SubCard title='Mô tả'>
              <Typography variant='h4'>{dataStaff?.name}</Typography>
              <Typography variant='caption' sx={{ mb: 2 }}>
                Nhân viên xuất sắc
              </Typography>
              <p></p>
              <Typography variant='h6' textAlign={'start'}>
                Hello,I’m Anshan Handgun Creative Graphic Designer & User Experience Designer based in Website, I create
                digital Products a more Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus at.
              </Typography>
            </SubCard>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <SubCard title='Liên hệ'>
              <Typography variant='h4' sx={{ mb: 1 }}>
                Số điện thoại
              </Typography>
              <Typography variant='caption' sx={{ mb: 2 }}>
                {dataStaff?.phoneNumber}
                {dataStaff?.phoneNumber && (
                  <IconButton color='inherit' size='small' disableRipple onClick={() => handleCopy('0333968599')}>
                    <ContentCopyIcon fontSize='inherit' />
                  </IconButton>
                )}
              </Typography>
              <p></p>
              <Typography variant='h4'>Email</Typography>
              <Typography variant='caption' sx={{ mb: 2 }} onClick={() => handleCopy('dinhanhdung03011999@gmail.com')}>
                {dataStaff?.email}
                {dataStaff?.email && (
                  <IconButton color='inherit' size='small' disableRipple>
                    <ContentCopyIcon fontSize='inherit' />
                  </IconButton>
                )}
              </Typography>
            </SubCard>
          </Grid>
        </Grid>
        <Grid container spacing={gridSpacing} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={12}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs variant='scrollable' value={tab} onChange={handleChangeTab} aria-label='basic tabs example'>
                <Tab label='Thông tin cá nhân' {...a11yProps(0)} />
                {/* <Tab label='Người đại diện' {...a11yProps(1)} /> */}
                <Tab label='Lương thưởng' {...a11yProps(1)} />
                <Tab label='Đổi mật khẩu' {...a11yProps(2)} />
                <Tab label='Lịch sử làm việc' {...a11yProps(3)} />
                <Tab label='Mức độ cảnh báo' {...a11yProps(4)} />
                <Tab label='KPI' {...a11yProps(5)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0}>
              <TabInfoStaff data={dataStaff} reloadData={() => refetch()} />
            </CustomTabPanel>
            {/* <CustomTabPanel value={tab} index={1}>
              <TabInfoRelationship data={dataStaff} reloadData={() => refetch()} />
            </CustomTabPanel> */}
            <CustomTabPanel value={tab} index={1}>
              <TabSalary dataStaff={dataStaff} />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={2}>
              <TabChangePassword data={dataStaff} />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={3}>
              <TabWorkProgress dataStaff={dataStaff} />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={4}>
              <TabAlertLevels />
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={5}>
              <TabKPI />
            </CustomTabPanel>
          </Grid>
        </Grid>
      </MainCard>
    </>
  )
}

export default StaffDetailPage

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}
