import CloseIcon from '@mui/icons-material/Close'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import * as React from 'react'

interface BootstrapDialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose?: () => void
  fontSize?: string
}

export const BootstrapDialogTitle = (props: BootstrapDialogTitleProps) => {
  const { children, onClose, fontSize, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2, fontSize: fontSize || '1.25rem' }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}
