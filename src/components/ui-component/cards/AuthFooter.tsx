// material-ui
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction='row' justifyContent='space-between'>
    <Typography variant='subtitle2' component={Link} href='https://trucks.vn' target='_blank' underline='hover'>
      strucks.vn
    </Typography>
    <Typography variant='subtitle2' component={Link} href='dungitvn' target='_blank' underline='hover'>
      &copy; DUNGITVN
    </Typography>
  </Stack>
)

export default AuthFooter
