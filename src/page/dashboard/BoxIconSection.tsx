import { Avatar, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import * as React from 'react'

export const BoxIconSection = ({
  icon,
  colorBoxIcon,
  backgroundBoxIcon
}: {
  icon?: React.ReactNode
  colorBoxIcon: string
  backgroundBoxIcon: string
}) => {
  const theme = useTheme()
  return icon ? (
    <Box
      sx={{
        mr: 1,
        [theme.breakpoints.down('md')]: {
          mr: 1
        }
      }}
    >
      <Avatar
        variant='rounded'
        sx={{
          ...theme.typography.commonAvatar,
          ...theme.typography.mediumAvatar,
          background: backgroundBoxIcon || theme.palette.secondary.light,
          color: colorBoxIcon || theme.palette.secondary.dark
          //   '&[aria-controls="menu-list-grow"],&:hover': {
          //     background: theme.palette.secondary.dark,
          //     color: theme.palette.secondary.light
          //   }
        }}
      >
        {icon}
      </Avatar>
    </Box>
  ) : (
    <></>
  )
}
