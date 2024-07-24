// LoadingModal.js
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { COLORS } from '../../common/colors'

const useStyles = makeStyles({
  backdrop: {
    color: COLORS.main
  }
})

const LoadingModal = ({ open }: { open: boolean }) => {
  const theme = useTheme()
  const classes = useStyles()

  return (
    <Backdrop className={classes.backdrop} open={open} style={{ zIndex: theme.zIndex.drawer + 1 }}>
      <CircularProgress color='inherit' />
    </Backdrop>
  )
}

export default LoadingModal
