import React from 'react'
import { alpha, useTheme, Theme } from '@mui/material/styles'
import MuiChip, { ChipProps as MuiChipProps } from '@mui/material/Chip'
import { SxProps } from '@mui/system'

type ChipColor = 'primary' | 'secondary' | 'success' | 'error' | 'orange' | 'warning'

interface ChipProps extends MuiChipProps {
  chipcolor?: ChipColor
  variant?: 'outlined' | 'filled'
  sx: SxProps<Theme>
}

// Định nghĩa kiểu cho sx
type SXProps = SxProps<Theme>

const Chip: React.FC<ChipProps> = ({ chipcolor = 'primary', disabled, sx = {}, variant = 'filled', ...others }) => {
  const theme = useTheme()

  let defaultSX: SxProps<Theme> = {
    color: 'primary.main',
    bgcolor: 'primary.light',
    ':hover': {
      color: 'primary.light',
      bgcolor: 'primary.dark'
    }
  }

  let outlineSX: SxProps<Theme> = {
    color: 'primary.main',
    bgcolor: 'transparent',
    border: '1px solid',
    borderColor: 'primary.main',
    ':hover': {
      color: 'primary.light',
      bgcolor: 'primary.dark'
    }
  }

  switch (chipcolor) {
    case 'secondary':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'secondary.main',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'secondary.main',
            ':hover': {
              color: 'secondary.main',
              bgcolor: 'secondary.light'
            }
          })
        : (defaultSX = {
            color: 'secondary.main',
            bgcolor: 'secondary.light',
            ':hover': {
              color: 'secondary.light',
              bgcolor: 'secondary.main'
            }
          })
      break
    case 'success':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'success.dark',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'success.dark',
            ':hover': {
              color: 'success.dark',
              bgcolor: alpha(theme.palette.success.light, 0.6)
            }
          })
        : (defaultSX = {
            color: 'success.dark',
            bgcolor: alpha(theme.palette.success.light, 0.6),
            ':hover': {
              color: 'success.light',
              bgcolor: 'success.dark'
            }
          })
      break
    case 'error':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'error.main',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'error.main',
            ':hover': {
              color: 'error.dark',
              bgcolor: 'error.light'
            }
          })
        : (defaultSX = {
            color: 'error.dark',
            bgcolor: alpha(theme.palette.error.light, 0.6),
            ':hover': {
              color: 'error.light',
              bgcolor: 'error.dark'
            }
          })
      break
    case 'orange':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'orange.dark',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'orange.main',
            ':hover': {
              color: 'orange.dark',
              bgcolor: 'orange.light'
            }
          })
        : (defaultSX = {
            color: 'orange.dark',
            bgcolor: 'orange.light',
            ':hover': {
              color: 'orange.light',
              bgcolor: 'orange.dark'
            }
          })
      break
    case 'warning':
      variant === 'outlined'
        ? (outlineSX = {
            color: 'warning.dark',
            bgcolor: 'transparent',
            border: '1px solid',
            borderColor: 'warning.dark',
            ':hover': {
              color: 'warning.dark',
              bgcolor: 'warning.light'
            }
          })
        : (defaultSX = {
            color: 'warning.dark',
            bgcolor: 'warning.light',
            ':hover': {
              color: 'warning.light',
              bgcolor: 'warning.dark'
            }
          })
      break
    default:
  }

  if (disabled) {
    variant === 'outlined'
      ? (outlineSX = {
          color: 'grey.500',
          bgcolor: 'transparent',
          border: '1px solid',
          borderColor: 'grey.500',
          ':hover': {
            color: 'grey.500',
            bgcolor: 'transparent'
          }
        })
      : (defaultSX = {
          color: 'grey.500',
          bgcolor: 'grey.50',
          ':hover': {
            color: 'grey.500',
            bgcolor: 'grey.50'
          }
        })
  }

  let SX: SXProps = defaultSX
  if (variant === 'outlined') {
    SX = outlineSX
  }
  SX = { ...SX, ...sx }

  return <MuiChip {...others} sx={SX} />
}

export default Chip
