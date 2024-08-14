import React from 'react'
import { Paper, ClickAwayListener } from '@mui/material'
import Popper from '@mui/material/Popper'
import { useTheme } from '@mui/material/styles'
import Transitions from '../ui-component/extended/Transitions'
import MainCard from '../ui-component/cards/MainCard'

interface PopperComponentProps {
  open: boolean
  anchorRef: React.RefObject<HTMLElement>
  handleClose: (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  children: React.ReactNode
  clickAway?: boolean
}

const PopperComponent: React.FC<PopperComponentProps> = ({ open, anchorRef, handleClose, children, clickAway }) => {
  const theme = useTheme()

  return (
    <Popper
      sx={{ zIndex: 1200 }}
      placement='bottom-end'
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      transition
      disablePortal
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]
      }}
    >
      {({ TransitionProps }) => (
        <Transitions in={open} {...TransitionProps}>
          <Paper>
            <ClickAwayListener onClickAway={(e) => clickAway && handleClose(e)}>
              <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                {children}
              </MainCard>
            </ClickAwayListener>
          </Paper>
        </Transitions>
      )}
    </Popper>
  )
}

export default PopperComponent
