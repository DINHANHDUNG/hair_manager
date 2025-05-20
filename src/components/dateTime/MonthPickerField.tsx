import CalendarIcon from '@mui/icons-material/CalendarToday'
import { Box, Popover, TextField } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { Dayjs } from 'dayjs'
import { useState } from 'react'

interface Props {
  value: Dayjs | null
  setValue: (val: Dayjs | null) => void
  label?: string
  disabled?: boolean
  size?: 'small' | 'medium'
}

export default function MonthPickerField({ value, setValue, label, disabled, size }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setValue(newDate.startOf('month')) // Đảm bảo chọn đầu tháng
      handleClose()
    }
  }

  const open = Boolean(anchorEl)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
      <TextField
        label={label}
        value={value ? value.format('MM/YYYY') : ''}
        onClick={handleOpen}
        InputProps={{
          endAdornment: <CalendarIcon fontSize='small' />,
          readOnly: true
        }}
        fullWidth
        size={size || 'small'}
        disabled={disabled}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box p={1}>
          <StaticDatePicker
            displayStaticWrapperAs='desktop'
            openTo='month'
            views={['year', 'month']}
            value={value}
            onChange={handleChange}
            slotProps={{
              actionBar: {
                actions: ['clear']
              }
            }}
          />
        </Box>
      </Popover>
    </LocalizationProvider>
  )
}
