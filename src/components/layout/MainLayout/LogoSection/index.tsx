import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

// material-ui
import ButtonBase from '@mui/material/ButtonBase'

// project imports
import { Box } from '@mui/system'
import { menuOpen } from '../../../../app/features/customization/customizationSlice'
import { useAppSelector } from '../../../../app/hooks'
import { customTheme } from '../../../../app/selectedStore'
import { images } from '../../../../assets/images'
import { config } from '../../../../constants'

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useAppSelector(customTheme)
  const dispatch = useDispatch()
  return (
    <ButtonBase
      disableRipple
      onClick={() => dispatch(menuOpen({ id: defaultId }))}
      component={Link}
      to={config.defaultPath}
    >
      <Box
        component='img'
        sx={{
          height: 60,
          width: '100%`',
          maxHeight: { xs: 60, md: 60 },
          maxWidth: { xs: '100%', md: '100%' }
        }}
        alt='Logo'
        src={images.logoString}
      />
    </ButtonBase>
  )
}

export default LogoSection
