import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

export const styleSalaryPayPage = makeStyles({
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
