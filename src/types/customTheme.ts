// import { TypographyOptions } from '@mui/material/styles/createTypography'
import colors from '../assets/scss/_themes-vars.module.scss'

export interface Customization {
  borderRadius: number
  fontFamily: string
  navType?: string
}

export interface ThemeOption {
  colors: typeof colors
  heading: string
  paper: string
  backgroundDefault: string
  background: string
  darkTextPrimary: string
  darkTextSecondary: string
  textDark: string
  menuSelected: string
  menuSelectedBack: string
  divider: string
  customization: Customization
}

// Define a new interface for custom typography properties
// export interface CustomTypography extends TypographyOptions {
//   mainContent?: {
//     backgroundColor?: string
//     width?: string
//     minHeight?: string
//     flexGrow?: number
//     padding?: string
//     marginTop?: string
//     marginRight?: string
//     borderRadius?: string
//   }
// }

// interface CustomTypographyOptions extends TypographyOptions {
//   mainContent?: {
//     backgroundColor?: string
//     width?: string
//     minHeight?: string
//     flexGrow?: number
//     padding?: string
//     marginTop?: string
//     marginRight?: string
//     borderRadius?: string
//   }
//   customInput?: {
//     marginTop?: number
//     marginBottom?: number
//     '& > label'?: {
//       top?: number
//       left?: number
//       color?: string
//       '&[data-shrink="false"]'?: {
//         top?: number
//       }
//     }
//     '& > div > input'?: {
//       padding?: string
//     }
//     '& legend'?: {
//       display?: string
//     }
//     '& fieldset'?: {
//       top?: number
//     }
//   }
//   menuCaption?: {
//     fontSize?: string
//     fontWeight?: number
//     color?: string
//     padding?: string
//     textTransform?: string
//     marginTop?: string
//   }
//   subMenuCaption?: {
//     fontSize?: string
//     fontWeight?: number
//     color?: string
//     textTransform?: string
//   }
//   commonAvatar?: {
//     cursor?: string
//     borderRadius?: string
//   }
//   smallAvatar?: {
//     width?: string
//     height?: string
//     fontSize?: string
//   }
//   mediumAvatar?: {
//     width?: string
//     height?: string
//     fontSize?: string
//   }
//   largeAvatar?: {
//     width?: string
//     height?: string
//     fontSize?: string
//   }
// }

// Extend the existing Theme interface to include custom typography
// export interface CustomTheme extends Theme {
//   typography: CustomTypographyOptions
// }
