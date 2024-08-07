import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import { BootstrapDialogTitle } from './BootstrapDialogTitle'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

interface CustomDialogProps extends DialogProps {
  title: string
  children: React.ReactNode
  onSave?: () => void
  onClose: () => void
  saveButtonText?: string
  actions?: boolean
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  children,
  onClose,
  onSave,
  open,
  saveButtonText = 'Lưu',
  actions,
  ...dialogProps
}) => {
  return (
    <BootstrapDialog onClose={onClose} aria-labelledby='customized-dialog-title' open={open} {...dialogProps}>
      <BootstrapDialogTitle id='customized-dialog-title' onClose={onClose}>
        {title}
      </BootstrapDialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {actions && (
        <DialogActions>
          <Button autoFocus onClick={onSave}>
            {saveButtonText}
          </Button>
        </DialogActions>
      )}
    </BootstrapDialog>
  )
}
