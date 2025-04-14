import { IconButton, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { styled } from '@mui/material/styles'
import { RiCloseFill } from '@remixicon/react'
import * as React from 'react'
import { COLORS } from '../../common/colors'
import { BootstrapDialogTitle } from './BootstrapDialogTitle'

// const BootstrapDialog = styled(Dialog)<{ customstyles?: React.CSSProperties }>(({ theme, customstyles }) => ({
//   '& .MuiDialogContent-root': {
//     padding: theme.spacing(2)
//   },
//   '& .MuiDialogActions-root': {
//     padding: theme.spacing(1)
//   },
//   '& .MuiDialog-paperFullWidth': {
//     // Giữ nguyên các style mặc định nếu không truyền customstyles
//     ...customstyles // Áp dụng các styles tùy chỉnh nếu có
//   }
// }))

const BootstrapDialog = styled(Dialog)<{ customstyles?: React.CSSProperties }>(({ theme, customstyles }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    maxHeight: 'calc(100vh - 200px)', // hoặc một giá trị phù hợp với chiều cao bạn mong muốn
    overflowY: 'auto'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },
  '& .MuiDialog-paperFullWidth': {
    ...customstyles,
    maxHeight: 'calc(100vh - 64px)', // Giới hạn chiều cao tổng thể của modal
    display: 'flex',
    flexDirection: 'column'
  }
}))

interface CustomDialogProps extends Omit<DialogProps, 'title'> {
  title: string | React.ReactNode
  hiddenTitle?: boolean
  subTitle?: React.ReactNode
  children: React.ReactNode
  onSave?: () => void
  onClose: () => void
  saveButtonText?: string
  actions?: boolean
  classesTitle?: string
  id?: string
  customstyles?: React.CSSProperties
  btnClose?: boolean
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  children,
  onClose,
  onSave,
  open,
  saveButtonText = 'Lưu',
  actions,
  subTitle,
  classesTitle,
  id,
  customstyles,
  hiddenTitle,
  btnClose,
  ...dialogProps
}) => {
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby={id ? id : 'customized-dialog-title'}
      open={open}
      customstyles={customstyles}
      {...dialogProps}
    >
      {!hiddenTitle && (
        <BootstrapDialogTitle id={id ? id : 'customized-dialog-title'} onClose={onClose}>
          <span>
            {title}
            {subTitle && (
              <Typography variant='h5' sx={{ color: COLORS.text, fontSize: '12px', fontWeight: '400' }}>
                {subTitle}
              </Typography>
            )}
          </span>
        </BootstrapDialogTitle>
      )}

      {btnClose && onClose ? (
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
          <RiCloseFill color={COLORS.text} />
        </IconButton>
      ) : null}

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
