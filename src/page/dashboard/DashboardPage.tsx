import { Card, CardContent, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { DateRange } from '@mui/x-date-pickers-pro'
import { IconCoin, IconCoins, IconTimelineEvent, IconUser, IconUsersGroup } from '@tabler/icons-react'
import dayjs, { Dayjs } from 'dayjs'
import * as React from 'react'
import DateRangePickerShortCut from '../../components/dateTime/DateRangePickerShortCut'
import MainCard from '../../components/ui-component/cards/MainCard'
import { gridSpacing } from '../../constants'
import { FooterBoxSection } from './FooterBoxSection'
import { HeaderBoxSection } from './HeaderBoxSection'
import { WorkerChart } from './WorkerChart'
import { styleDashboard } from './dashboardPage.style'
import { useGetStaticStaffTotalQuery } from '../../app/services/statistic'

const Dashboard = React.memo(() => {
  const theme = useTheme()
  const today = dayjs()
  const classes = styleDashboard(theme)
  const [valueRangeDate, setValueRangeDate] = React.useState<DateRange<Dayjs> | undefined>([
    today.startOf('month'),
    today.endOf('month')
  ])

  const { data: dataToTalStaff } = useGetStaticStaffTotalQuery({})
  const percentageIncreaseStaff = dataToTalStaff?.data?.percentageIncrease
  const currentMonthStaff = dataToTalStaff?.data?.currentMonth

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
                textTitle='Tổng số công nhân'
              />
              <FooterBoxSection elementLeft={'100'} elementRight={'+0%'} />
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
                textTitle='Tổng số nhân viên'
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
                colorBoxIcon={theme.palette.success.dark}
                icon={<IconTimelineEvent stroke={1.5} size='1.3rem' />}
                textTitle='Chấm công'
              />
              <FooterBoxSection elementLeft={'100+'} elementRight={'+20%'} colorRight={theme.palette.success.dark} />
            </>
          }
        />

        <Grid item xs={12} sm={6} md={6} lg={3} classes={classes.CardContent}>
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
        </Grid>
      </Grid>
      <MainCard
        title={
          <Grid container direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='subtitle1'>Số công nhân</Typography>
            <DateRangePickerShortCut
              value={valueRangeDate}
              setValue={(newValue) => setValueRangeDate(newValue)}
              variant='standard'
            />
          </Grid>
        }
      >
        <WorkerChart />
      </MainCard>
    </div>
  )
})

export default Dashboard
