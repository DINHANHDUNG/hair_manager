import PropTypes from 'prop-types'
import React from 'react'

// material-ui
import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar'

// Define the prop types
interface AvatarProps extends MuiAvatarProps {
  color?: string
  outline?: boolean
  size?: 'badge' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  sx?: object
}

// ==============================|| AVATAR ||============================== //

const Avatar: React.FC<AvatarProps> = ({ color, outline, size, sx, ...others }) => {
  const colorSX = color && !outline && { color: 'background.paper', bgcolor: `${color}.main` }
  const outlineSX = outline && {
    color: color ? `${color}.main` : 'primary.main',
    bgcolor: 'background.paper',
    border: '2px solid',
    borderColor: color ? `${color}.main` : 'primary.main'
  }
  let sizeSX = {}
  switch (size) {
    case 'badge':
      sizeSX = { width: 28, height: 28 }
      break
    case 'xs':
      sizeSX = { width: 34, height: 34 }
      break
    case 'sm':
      sizeSX = { width: 40, height: 40 }
      break
    case 'lg':
      sizeSX = { width: 72, height: 72 }
      break
    case 'xl':
      sizeSX = { width: 82, height: 82 }
      break
    case 'md':
      sizeSX = { width: 60, height: 60 }
      break
    default:
      sizeSX = { width: 120, height: 120 }
  }

  return <MuiAvatar sx={{ ...colorSX, ...outlineSX, ...sizeSX, ...sx }} {...others} />
}

// Add prop types validation for JavaScript users
Avatar.propTypes = {
  color: PropTypes.string,
  outline: PropTypes.bool,
  size: PropTypes.oneOf(['badge', 'xs', 'sm', 'md', 'lg', 'xl']),
  sx: PropTypes.object
}

export default Avatar
