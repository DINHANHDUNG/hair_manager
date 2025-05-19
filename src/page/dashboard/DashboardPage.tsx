import { Card, CardContent, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { IconCoin, IconUser, IconUsersGroup } from '@tabler/icons-react'
import * as React from 'react'
import { useGetStaticOrderTotalMonthQuery } from '../../app/services/statistic'
import MainCard from '../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../constants'
import { FooterBoxSection, FooterBoxSection2 } from './FooterBoxSection'
import { HeaderBoxSection } from './HeaderBoxSection'
import { WorkerChart } from './WorkerChart'
import { styleDashboard } from './dashboardPage.style'
import DateRangePickerShortCut from '../../components/dateTime/DateRangePickerShortCut'
import { DateRange } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'
import MonthPickerField from '../../components/dateTime/MonthPickerField'
import moment from 'moment'

const Dashboard = React.memo(() => {
  const theme = useTheme()
  // const today = dayjs()
  const classes = styleDashboard(theme)

  const [month, setMonth] = React.useState<Dayjs | null>(dayjs())

  const selectedMonth = month || dayjs()
  const monthCV = moment(selectedMonth.toString()).format('MM-YYYY')

  const { data: dataToTal } = useGetStaticOrderTotalMonthQuery({
    month: monthCV
  })
  const totalComplate = dataToTal?.data?.completeOrder
  const totalOrder = dataToTal?.data?.totalOrder
  const lateOrder = dataToTal?.data?.lateOrder

  const CardContentBoxSection = ({ element }: { element: React.ReactNode }) => {
    return (
      <Grid item xs={12} sm={6} md={6} lg={4}>
        <Card
          sx={{
            bgcolor: theme.palette.background.paper,
            height: '100%'
          }}
        >
          <CardContent className={classes.CardContent}>{element}</CardContent>
        </Card>
      </Grid>
    )
  }

  return (
    <div>
      {/* <DateRangePickerShortCut
        value={valueRangeDate}
        setValue={(newValue) => setValueRangeDate(newValue)}
        variant='standard'
      /> */}
      <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={8} lg={8}></Grid>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <MonthPickerField value={month} setValue={setMonth} />
        </Grid>
      </Grid>

      <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
        <CardContentBoxSection
          element={
            <>
              <HeaderBoxSection
                backgroundBoxIcon={theme.palette.secondary.light}
                colorBoxIcon={theme.palette.secondary.dark}
                icon={<IconUsersGroup stroke={1.5} size='1.3rem' />}
                textTitle='Tổng số'
              />
              <FooterBoxSection
                elementLeft={totalOrder || 0}
                // elementRight={percentageIncreaseEmployee ? percentageIncreaseEmployee.toString() + '%' : 0}
                // colorRight={
                //   percentageIncreaseEmployee && percentageIncreaseEmployee > 0
                //     ? theme.palette.success.dark
                //     : theme.palette.error.dark
                // }
              />
            </>
          }
        />
        <CardContentBoxSection
          element={
            <>
              <HeaderBoxSection
                backgroundBoxIcon={theme.palette.secondary.light}
                colorBoxIcon={theme.palette.error.dark}
                icon={<IconUser stroke={1.5} size='1.3rem' />}
                textTitle='Số đơn hoàn thành'
              />
              <FooterBoxSection
                elementLeft={totalComplate || 0}
                // elementRight={percentageIncreaseStaff ? percentageIncreaseStaff.toString() + '%' : 0}
                // colorRight={
                //   percentageIncreaseStaff && percentageIncreaseStaff > 0
                //     ? theme.palette.success.dark
                //     : theme.palette.error.dark
                // }
              />
            </>
          }
        />
        <CardContentBoxSection
          element={
            <>
              <HeaderBoxSection
                backgroundBoxIcon={theme.palette.secondary.light}
                colorBoxIcon={theme.palette.orange.dark}
                icon={<IconCoin stroke={1.5} size='1.3rem' />}
                textTitle='Số đơn chậm'
              />
              <FooterBoxSection2
                elementLeft={`Chậm 1: ${lateOrder?.lateOrder1 || 0}`}
                elementRight={'1-3 ngày'}
                colorRight={theme.palette.error.dark}
              />
              <FooterBoxSection2
                elementLeft={`Chậm 2: ${lateOrder?.lateOrder2 || 0}`}
                elementRight={'4-6 ngày'}
                colorRight={theme.palette.error.dark}
              />
              <FooterBoxSection2
                elementLeft={`Chậm 3: ${lateOrder?.lateOrder3 || 0}`}
                elementRight={'>7 ngày'}
                colorRight={theme.palette.error.dark}
              />
            </>
          }
        />
        {/* <CardContentBoxSection
          element={
            <>
              <HeaderBoxSection
                backgroundBoxIcon={theme.palette.secondary.light}
                colorBoxIcon={theme.palette.orange.main}
                icon={<IconCoins stroke={1.5} size='1.3rem' />}
                textTitle='Đã huỷ'
              />
              <FooterBoxSection
                elementLeft={currency(totalSalaryRefund)}
                elementRight={''}
                colorRight={theme.palette.success.dark}
              />
            </>
          }
        /> */}

        {/* <Grid item xs={12} sm={6} md={6} lg={3} classes={classes.CardContent}>
          <Card classes={styleDashboard(theme).CardContent1} sx={{ mb: 1 }}>
            <CardContent sx={{ flex: 1 }}>
              <HeaderBoxSection
                backgroundBoxIcon={theme.palette.secondary.light}
                colorBoxIcon={theme.palette.orange.dark}
                icon={<IconCoin stroke={1.5} size='1.3rem' />}
                textTitle='Thanh toán lương'
                hederRight={
                  <Typography classes={classes.TextCard} variant='subtitle1'>
                    60/120
                  </Typography>
                }
              />
            </CardContent>
          </Card>
          <Card classes={styleDashboard(theme).CardContent1}>
            <CardContent sx={{ flex: 1 }}>
              <HeaderBoxSection
                backgroundBoxIcon={theme.palette.secondary.light}
                colorBoxIcon={theme.palette.orange.main}
                icon={<IconCoins stroke={1.5} size='1.3rem' />}
                textTitle='Tổng số ứng lương'
                hederRight={
                  <Typography classes={classes.TextCard} variant='subtitle1'>
                    60/120
                  </Typography>
                }
              />
            </CardContent>
          </Card>
        </Grid> */}
      </Grid>
      <MainCard
        title={
          <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='subtitle1'>Số lượng đơn</Typography>
          </Grid>
        }
      >
        <WorkerChart />
      </MainCard>
    </div>
  )
})

export default Dashboard
