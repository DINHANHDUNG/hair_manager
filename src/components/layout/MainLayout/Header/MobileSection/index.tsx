import { useEffect, useRef, useState } from 'react'

// material-ui
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import Toolbar from '@mui/material/Toolbar'

// project import

import ProfileSection from '../ProfileSection'
import SearchSection from '../SearchSection'

// assets
// import { MoreOutlined } from '@ant-design/icons'
import Transitions from '../../../../ui-component/extended/Transitions'

// ==============================|| HEADER CONTENT - MOBILE ||============================== //

const MobileSection = () => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLElement>(null)
  // const anchorRef: RefObject<HTMLElement> = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: MouseEvent | TouchEvent) => {
    // Check if the event target is within the element referenced by anchorRef
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return
    }

    // Set the state to close the menu or dialog
    setOpen(false)
  }

  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          component='span'
          disableRipple
          sx={{
            bgcolor: open ? 'grey.300' : 'grey.100'
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
          color='inherit'
        >
          {/* <MoreOutlined /> */}
          ICON
        </IconButton>
      </Box>
      <Popper
        placement='bottom-end'
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{
          width: '100%'
        }}
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type='fade' in={open} {...TransitionProps}>
            <Paper
            // sx={{ boxShadow: theme.customShadows.z1 }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <AppBar color='inherit'>
                  <Toolbar>
                    <SearchSection />
                    <ProfileSection />
                  </Toolbar>
                </AppBar>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  )
}

export default MobileSection
