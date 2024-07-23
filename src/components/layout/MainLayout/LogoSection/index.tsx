import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// material-ui
import ButtonBase from '@mui/material/ButtonBase'

// project imports
import { useAppSelector } from '../../../../app/hooks'
import { customTheme } from '../../../../app/selectedStore'
import { menuOpen } from '../../../../app/features/customization/customizationSlice'
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
      {/* <Logo /> */}
      Logo
    </ButtonBase>
  )
}

export default LogoSection
