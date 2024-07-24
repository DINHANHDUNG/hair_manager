import { Typography } from '@mui/material'
import MainCard from '../../components/ui-component/cards/MainCard'

const NotAuthorizedPage = () => {
  return (
    <MainCard title='Sample Card'>
      <Typography variant='body2'>Bạn không có quyền truy cập. Liên hệ admin để được cấp quyền</Typography>
    </MainCard>
  )
}

export default NotAuthorizedPage
