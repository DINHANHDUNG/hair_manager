import { createTheme, ThemeOptions, PaletteOptions } from '@mui/material/styles'
import colors from '../assets/scss/_themes-vars.module.scss'
import componentStyleOverrides from './compStyleOverride'
import themePalette from './palette'
import themeTypography from './typography'
import { Customization, ThemeOption } from '../types/customTheme'

const theme = (customization: Customization) => {
  const color = colors

  const themeOption: ThemeOption = {
    colors: color,
    heading: color.grey900,
    paper: color.paper,
    backgroundDefault: color.paper,
    background: color.primaryLight,
    darkTextPrimary: color.grey700,
    darkTextSecondary: color.grey500,
    textDark: color.grey900,
    menuSelected: color.secondaryDark,
    menuSelectedBack: color.secondaryLight,
    divider: color.grey200,
    customization
  }

  const themeOptions: ThemeOptions = {
    direction: 'ltr',
    palette: themePalette(themeOption) as PaletteOptions,
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption)
  }

  const themes = createTheme(themeOptions)

  themes.components = {
    ...componentStyleOverrides(themeOption),
    MuiCssBaseline: {
      styleOverrides: {
        mainContent: {
          backgroundColor: themeOption.background,
          width: '100%',
          minHeight: 'calc(100vh - 88px)',
          flexGrow: 1,
          padding: '20px',
          marginTop: '88px',
          marginRight: '20px',
          borderRadius: `${themeOption.customization.borderRadius}px`
        },
        customInput: {
          marginTop: 1,
          marginBottom: 1,
          '& > label': {
            top: 23,
            left: 0,
            color: themeOption.colors.grey500,
            '&[data-shrink="false"]': {
              top: 5
            }
          },
          '& > div > input': {
            padding: '30.5px 14px 11.5px !important'
          },
          '& legend': {
            display: 'none'
          },
          '& fieldset': {
            top: 0
          }
        }
      }
    }
  }

  return themes
}

export default theme
