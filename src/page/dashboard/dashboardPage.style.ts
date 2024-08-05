import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

export const styleDashboard = makeStyles({
  CardContent: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' },
  TextCard: { fontWeight: '700', fontSize: 20 },
  CardContent1: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap'
  })
})
