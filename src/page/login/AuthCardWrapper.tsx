// material-ui
import Box from '@mui/material/Box'
import MainCard from '../../components/ui-component/cards/MainCard'
import { ReactNode } from 'react'

// project import

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //
interface AuthCardWrapperProps {
  children: ReactNode
}

const AuthCardWrapper: React.FC<AuthCardWrapperProps> = ({ children, ...other }) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, lg: 475 },
      margin: { xs: 2.5, md: 3 },
      '& > *': {
        flexGrow: 1,
        flexBasis: '50%'
      }
    }}
    content={false}
    {...other}
  >
    <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>{children}</Box>
  </MainCard>
)

export default AuthCardWrapper
