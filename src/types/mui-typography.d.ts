interface CustomTypographyOptions extends TypographyOptions {
  fontFamily: theme.customization.fontFamily
  h6: {
    fontWeight: number
    color: string
    fontSize: string
  }
  h5: {
    fontSize: string
    color: string
    fontWeight: number
  }
  h4: {
    fontSize: string
    color: string
    fontWeight: number
  }
  h3: {
    fontSize: string
    color: string
    fontWeight: number
  }
  h2: {
    fontSize: string
    color: string
    fontWeight: number
  }
  h1: {
    fontSize: string
    color: string
    fontWeight: number
  }
  subtitle1: {
    fontSize: string
    fontWeight: number
    color: theme.textDark
  }
  subtitle2: {
    fontSize: string
    fontWeight: number
    color: theme.darkTextSecondary
  }
  caption: {
    fontSize: string
    color: theme.darkTextSecondary
    fontWeight: number
  }
  body1: {
    fontSize: string
    fontWeight: number
    lineHeight: string
    color: theme.textDark
  }
  body2: {
    letterSpacing: string
    fontWeight: number
    lineHeight: string
    color: theme.darkTextPrimary
  }
  button: {
    textTransform: string
  }
  mainContent: {
    backgroundColor: string
    width: string
    minHeight: string
    flexGrow: number
    padding: string
    marginTop: string
    marginRight: string
    borderRadius: string
  }
  menuCaption: {
    fontSize: string
    fontWeight: number
    color: string
    padding: string
    textTransform: string
    marginTop: string
  }
  subMenuCaption: {
    fontSize: string
    fontWeight: number
    color: theme.darkTextSecondary
    textTransform: string
  }
  commonAvatar: {
    cursor: string
    borderRadius: string
  }
  smallAvatar: {
    width: string
    height: string
    fontSize: string
  }
  mediumAvatar: {
    width: string
    height: string
    fontSize: string
  }
  largeAvatar: {
    width: string
    height: string
    fontSize: string
  }
  customInput: {
    marginTop?: number
    marginBottom?: number
    '& > label'?: {
      top?: number
      left?: number
      color?: string
      '&[data-shrink="false"]'?: {
        top?: number
      }
    }
    '& > div > input'?: {
      padding?: string
    }
    '& legend'?: {
      display?: string
    }
    '& fieldset'?: {
      top?: number
    }
  }
}
// theme.ts
import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypographyVariants extends CustomTypographyOptions {
    commonAvatar: React.CSSProperties
    customInput: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions extends CustomTypographyOptions {
    commonAvatar?: React.CSSProperties
    customInput?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    commonAvatar: true
    mediumAvatar: true
    customInput: true
  }
}
