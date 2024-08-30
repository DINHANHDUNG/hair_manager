import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Grid, IconButton, Tab, Tabs, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetEmployeeByIdQuery } from '../../../../app/services/employee'
import MyButton from '../../../../components/button/MyButton'
import MainCard from '../../../../components/ui-component/cards/MainCard'
import SubCard from '../../../../components/ui-component/cards/SubCard'
import Avatar from '../../../../components/ui-component/extended/Avatar'
import { gridSpacing } from '../../../../constants'
import { EmployeeType } from '../../../../types/employee'
import TabInfoEmployee from './TabInfo'
import TabInfoRelationship from './TabInfoRelationship'
import TabWorkProgress from './TabWorkProgress'
import TabInfoManager from './TabInfoManager'

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

const WorkerDetailPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [tab, setTab] = useState(0)
  const params = useParams()
  const employeeId = params?.id ? Number(params?.id) : null

  const { data: fetchEmployee, refetch } = useGetEmployeeByIdQuery(
    {
      employeeId: employeeId || 0
    },
    {
      skip: !employeeId
    }
  )

  const dataEmployee = fetchEmployee?.data || ({} as EmployeeType)

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
      <MainCard back title={'Thông tin chi tiết công nhân'} sx={{ height: '100%' }}>
        <Grid container spacing={gridSpacing} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <SubCard title='Ảnh đại diện' sx={{ mb: 2 }}>
              <Grid item xs={12} container alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
                <MyButton component='label' role={undefined} variant='text' tabIndex={-1} sx={{ border: 'none' }}>
                  <Avatar alt='John Doe' src={dataEmployee.avatar} sx={{ mb: 2 }} />
                  <VisuallyHiddenInput type='file' onChange={handleFileChange} />
                </MyButton>
                {/* <Typography variant='caption' sx={{ mb: 2 }}>
                  Nhấn vào ảnh để thay đổi
                </Typography> */}
                <Typography variant='h3' sx={{ mb: 2 }}>
                  {dataEmployee.name}
                </Typography>
              </Grid>
            </SubCard>
            <SubCard title='Liên hệ'>
              <Typography variant='h4' sx={{ mb: 1 }}>
                Số điện thoại
              </Typography>
              <Typography variant='caption' sx={{ mb: 2 }}>
                {dataEmployee.phoneNumber}
                {dataEmployee.phoneNumber && (
                  <IconButton color='inherit' size='small' disableRipple onClick={() => handleCopy('0333968599')}>
                    <ContentCopyIcon fontSize='inherit' />
                  </IconButton>
                )}
              </Typography>
              <p></p>
              <Typography variant='h4'>Email</Typography>
              <Typography variant='caption' sx={{ mb: 2 }} onClick={() => handleCopy('dinhanhdung03011999@gmail.com')}>
                {dataEmployee.email}
                {dataEmployee.email && (
                  <IconButton color='inherit' size='small' disableRipple>
                    <ContentCopyIcon fontSize='inherit' />
                  </IconButton>
                )}
              </Typography>
            </SubCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <SubCard title='Tất cả thông tin'>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs variant='scrollable' value={tab} onChange={handleChangeTab} aria-label='basic tabs example'>
                  <Tab label='Thông tin cá nhân' {...a11yProps(0)} />
                  <Tab label='Người đại diện' {...a11yProps(1)} />
                  <Tab label='Lịch sử làm việc' {...a11yProps(2)} />
                  <Tab label='Người quản lý' {...a11yProps(3)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={tab} index={0}>
                <TabInfoEmployee data={dataEmployee} reloadData={() => refetch()} />
              </CustomTabPanel>
              <CustomTabPanel value={tab} index={1}>
                <TabInfoRelationship data={dataEmployee} reloadData={() => refetch()} />
              </CustomTabPanel>
              <CustomTabPanel value={tab} index={2}>
                <TabWorkProgress dataEmployee={dataEmployee} reloadData={() => refetch()} />
              </CustomTabPanel>
              <CustomTabPanel value={tab} index={3}>
                <TabInfoManager data={dataEmployee} reloadData={() => refetch()} />
              </CustomTabPanel>
            </SubCard>
          </Grid>
        </Grid>
      </MainCard>
    </>
  )
}

export default WorkerDetailPage

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
