import { Card, CardContent, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { IconCoin, IconCoins, IconUser, IconUsersGroup } from '@tabler/icons-react'
// import dayjs from 'dayjs'
import * as React from 'react'
import { currency } from '../../app/hooks'
import {
  useGetStaticSalaryAdvanceQuery,
  useGetStaticStaffTotalQuery,
  useGetStatisticEmployeeTotalQuery
} from '../../app/services/statistic'
import MainCard from '../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../constants'
import { FooterBoxSection } from './FooterBoxSection'
import { HeaderBoxSection } from './HeaderBoxSection'
import { WorkerChart } from './WorkerChart'
import { styleDashboard } from './dashboardPage.style'

const Dashboard = React.memo(() => {
  const theme = useTheme()
  // const today = dayjs()
  const classes = styleDashboard(theme)
  // const [valueRangeDate, setValueRangeDate] = React.useState<DateRange<Dayjs> | undefined>([
  //   today.startOf('month'),
  //   today.endOf('month')
  // ])

  const { data: dataToTalStaff } = useGetStaticStaffTotalQuery({})
  const percentageIncreaseStaff = dataToTalStaff?.data?.percentageIncrease
  const currentMonthStaff = dataToTalStaff?.data?.currentMonth

  const { data: dataToTalEmployee } = useGetStatisticEmployeeTotalQuery({})
  const percentageIncreaseEmployee = dataToTalEmployee?.data?.percentageIncrease
  const currentMonthEmployee = dataToTalEmployee?.data?.currentMonth

  const { data: dataStaticSalaryAdvance } = useGetStaticSalaryAdvanceQuery({})
  const totalSalaryAdvance = dataStaticSalaryAdvance?.data?.totalSalaryAdvance || 0 //Đã ứng
  const totalSalaryRefund = dataStaticSalaryAdvance?.data?.totalSalaryRefund || 0 //Đã hoàn

  const CardContentBoxSection = ({ element }: { element: React.ReactNode }) => {
    return (
      <Grid item xs={12} sm={6} md={6} lg={3}>
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
      <Grid container spacing={gridSpacing} sx={{ mb: 2 }}>
        <CardContentBoxSection
          element={
            <>
              <HeaderBoxSection
                backgroundBoxIcon={theme.palette.secondary.light}
                colorBoxIcon={theme.palette.secondary.dark}
                icon={<IconUsersGroup stroke={1.5} size='1.3rem' />}
                textTitle='Tổng số đơn'
              />
              <FooterBoxSection
                elementLeft={currentMonthEmployee || 0}
                elementRight={percentageIncreaseEmployee ? percentageIncreaseEmployee.toString() + '%' : 0}
                colorRight={
                  percentageIncreaseEmployee && percentageIncreaseEmployee > 0
                    ? theme.palette.success.dark
                    : theme.palette.error.dark
                }
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
                textTitle='Đang giao'
              />
              <FooterBoxSection
                elementLeft={currentMonthStaff || 0}
                elementRight={percentageIncreaseStaff ? percentageIncreaseStaff.toString() + '%' : 0}
                colorRight={
                  percentageIncreaseStaff && percentageIncreaseStaff > 0
                    ? theme.palette.success.dark
                    : theme.palette.error.dark
                }
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
                textTitle='Đã giao'
              />
              <FooterBoxSection
                elementLeft={currency(totalSalaryAdvance)}
                elementRight={''}
                colorRight={theme.palette.success.dark}
              />
            </>
          }
        />
        <CardContentBoxSection
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
        />

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
            {/* <DateRangePickerShortCut
              value={valueRangeDate}
              setValue={(newValue) => setValueRangeDate(newValue)}
              variant='standard'
            /> */}
          </Grid>
        }
      >
        <WorkerChart />
      </MainCard>
    </div>
  )
})

export default Dashboard
