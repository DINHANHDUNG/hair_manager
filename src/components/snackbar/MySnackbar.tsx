import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

// Tạo một component Alert tùy chỉnh sử dụng MuiAlert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

interface SnackbarProps {
  open: boolean
  message: string
  severity: 'error' | 'warning' | 'info' | 'success'
  duration?: number
  onClose: () => void
  vertical?: 'bottom' | 'top'
  horizontal?: 'center' | 'left' | 'right'
}

const MySnackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  severity,
  duration = 3000, // Thời gian mặc định là 6000ms
  onClose,
  vertical,
  horizontal
}) => {
  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    onClose()
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: vertical || 'bottom', horizontal: horizontal || 'right' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default MySnackbar
