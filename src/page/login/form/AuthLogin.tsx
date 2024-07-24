import { useState } from 'react'

// material-ui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// third party
import { Formik } from 'formik'
import * as Yup from 'yup'

// project imports
import AnimateButton from '../../../components/ui-component/extended/AnimateButton'

// assets
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAppDispatch } from '../../../app/hooks'
import { setCredentials } from '../../../app/features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../../routers/helpersRouter/constantRouter'

const AuthLogin = ({ ...others }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [checked, setChecked] = useState(true)

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault()
  }

  return (
    <>
      <Grid container direction='column' justifyContent='center' spacing={2}>
        {/* <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              onClick={googleHandler}
              size='large'
              variant='outlined'
              sx={{
                color: 'grey.700',
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100]
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img src={Google} alt='google' width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
              </Box>
              Sign in with Google
            </Button>
          </AnimateButton>
        </Grid> */}
        {/* <Grid item xs={12}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Divider sx={{ flexGrow: 1 }} orientation='horizontal' />

            <Button
              variant='outlined'
              sx={{
                cursor: 'unset',
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${customization.borderRadius}px`
              }}
              disableRipple
              disabled
            >
              OR
            </Button>

            <Divider sx={{ flexGrow: 1 }} orientation='horizontal' />
          </Box>
        </Grid> */}
        <Grid item xs={12} container alignItems='center' justifyContent='center'>
          <Box sx={{ mb: 2 }}>
            <Typography variant='subtitle1'>Sign in with Email address</Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          email: '',
          password: '',
          key: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          key: Yup.string().max(255).required('Key is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            dispatch(
              setCredentials({
                refreshToken: 'abc',
                accessToken: 'abc',
                user: {
                  username: values.email,
                  Password: values.password,
                  roles: ['admin']
                }
              })
            )
            navigate(ROUTES.HOME)
            // alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor='outlined-adornment-email-login'>Email Address / Username</InputLabel>
              <OutlinedInput
                id='outlined-adornment-email-login'
                type='email'
                value={values.email}
                name='email'
                onBlur={handleBlur}
                onChange={handleChange}
                label='Email Address / Username'
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id='standard-weight-helper-text-email-login'>
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor='outlined-adornment-password-login'>Password</InputLabel>
              <OutlinedInput
                id='outlined-adornment-password-login'
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name='password'
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'
                      size='large'
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label='Password'
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id='standard-weight-helper-text-password-login'>
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.key && errors.key)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor='outlined-adornment-email-login'>key</InputLabel>
              <OutlinedInput
                id='outlined-adornment-email-login'
                type='key'
                value={values.key}
                name='key'
                onBlur={handleBlur}
                onChange={handleChange}
                label='key'
                inputProps={{}}
              />
              {touched.key && errors.key && (
                <FormHelperText error id='standard-weight-helper-text-email-login'>
                  {errors.key}
                </FormHelperText>
              )}
            </FormControl>
            <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name='checked'
                    color='primary'
                  />
                }
                label='Remember me'
              />
              {/* <Typography variant='subtitle1' color='secondary' sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                Forgot Password?
              </Typography> */}
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  color='secondary'
                >
                  Sign in
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  )
}

export default AuthLogin
