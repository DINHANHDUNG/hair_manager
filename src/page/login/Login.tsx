import { Grid, Theme } from '@mui/material'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'
import { images } from '../../assets/images'
import AuthFooter from '../../components/ui-component/cards/AuthFooter'
import AuthCardWrapper from './AuthCardWrapper'
import AuthWrapper1 from './AuthWrapper1'
import AuthLogin from './form/AuthLogin'
// import LoadingModal from '../../components/ui-component/LoadingModal'

const Login = () => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  // const [login, { isLoading }] = useLoginMutation()

  return (
    <AuthWrapper1>
      <Grid container direction='column' justifyContent='flex-end' sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent='center' alignItems='center' sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems='center' justifyContent='center'>
                  <Grid item>
                    <Link to='#' aria-label='logo'>
                      {/* <Logo /> */}
                      <Box
                        component='img'
                        sx={{
                          height: 100,
                          width: 100,
                          maxHeight: { xs: 100, md: 100 },
                          maxWidth: { xs: 100, md: 100 }
                        }}
                        alt='The house from the offer.'
                        src={images.logoToc}
                      />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={{ xs: 'column-reverse', md: 'row' }}
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Grid item>
                        <Stack alignItems='center' justifyContent='center' spacing={1}>
                          <Typography color='secondary.main' gutterBottom variant={downMD ? 'h3' : 'h2'}>
                            Hair Management
                          </Typography>
                          {/* <Typography variant='caption' fontSize='16px' textAlign={{ xs: 'center', md: 'inherit' }}>
                            Hair management
                          </Typography> */}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Grid item container direction='column' alignItems='center' xs={12}>
                      <Typography
                        component={Link}
                        to='/pages/register/register3'
                        variant='subtitle1'
                        sx={{ textDecoration: 'none' }}
                      >
                        Don&apos;t have an account?
                      </Typography>
                    </Grid>
                  </Grid> */}
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
      {/* <LoadingModal open={true} /> */}
    </AuthWrapper1>
  )
}

export default Login
