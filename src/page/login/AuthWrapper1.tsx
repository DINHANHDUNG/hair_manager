// material-ui
import { styled } from '@mui/material/styles'
import { images } from '../../assets/images'

// project imports

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  minHeight: '100vh',
  backgroundImage: `url(${images.logistic})`, // Đường dẫn tới hình ảnh nền
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

export default AuthWrapper1
