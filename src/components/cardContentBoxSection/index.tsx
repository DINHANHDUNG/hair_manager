import { Card, CardContent, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
// import { IconArrowUp } from '@tabler/icons-react'

export const CardContentBoxSection = ({
  element,
  title,
  content
}: {
  element?: React.ReactNode
  title?: string
  content?: React.ReactNode
}) => {
  const theme = useTheme()

  const classes = style(theme)
  return (
    <Grid item xs={12} sm={6} md={6} lg={2}>
      <Card
        sx={{
          bgcolor: theme.palette.background.paper,
          height: '100%'
        }}
      >
        <CardContent className={classes.CardContent}>
          {!element ? (
            <Grid item xs={12} sm={12} display={'flex'} flexDirection={'column'} alignItems={'center'}>
              <Typography className={classes.TextCard} variant='subtitle1'>
                {title}
              </Typography>
              <Typography className={classes.TextCardValue} variant='h4'>
                {/* <IconArrowUp className={classes.iconArrow} size='16' color='green' /> */}
                {content}
              </Typography>
              {/* <Typography variant='caption'>{'Giảm 8% sau 3 tháng'}</Typography> */}
            </Grid>
          ) : (
            element
          )}
        </CardContent>
      </Card>
    </Grid>
  )
}

const style = makeStyles({
  CardContent: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' },
  TextCard: { fontWeight: '500', fontSize: 13, marginBottom: 2 },
  TextCardValue: { marginBottom: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  iconArrow: { marginRight: 2 },
  statistics: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: 15
  })
})
