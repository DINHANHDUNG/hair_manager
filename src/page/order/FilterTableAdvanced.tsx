import { InputLabel, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { DateRange } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import MyButton from '../../components/button/MyButton'
import DateRangePickerShortCut from '../../components/dateTime/DateRangePickerShortCut'
import PopperComponent from '../../components/popper'
interface Props {
  label?: string
  open: boolean
  value?: { [field: string]: string }
  anchorRef: React.RefObject<HTMLElement>
  handleComfirm?: (value: StateFilterTableAdvanced) => void
  handleClose: (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

// Define the types for the state
export interface StateFilterTableAdvanced {
  phoneNumber: string
  code: string
  name: string
  date: DateRange<Dayjs> | undefined
}

export default function FilterTableAdvanced({
  open,
  anchorRef,
  handleClose,
  handleComfirm,
  value
}: Props) {
  const today = dayjs()

  const [state, setState] = useState<StateFilterTableAdvanced>({
    // company: '',
    // status: '',
    // age: [0, 100],
    date: [today.startOf('month'), today.endOf('month')],
    code: '',
    name: '',
    phoneNumber: ''
  })

  useEffect(() => {
    if (open && value) {
      setState({
        code: value?.code || '',
        name: value?.name || '',
        phoneNumber: value?.phoneNumber,
        date:
          value.dateFrom && value.dateTo
            ? [dayjs(value.dateFrom), dayjs(value.dateTo)]
            : [today.startOf('month'), today.endOf('month')]
      })
    }
  }, [open, value])

  const handleChangeState = (newValue: string, key: string) => {
    setState((prevState) => ({
      ...prevState,
      [key]: newValue || ''
    }))
  }

  const handleDateRangeChange = (newValue: DateRange<Dayjs> | undefined) => {
    setState((prevState) => ({
      ...prevState,
      date: newValue
    }))
  }

  return (
    <PopperComponent clickAway open={open} anchorRef={anchorRef} handleClose={handleClose}>
      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel htmlFor={`input-DateRangePickerShortCut`}>{`Từ ngày đến ngày`}</InputLabel>
        <DateRangePickerShortCut value={state.date} setValue={handleDateRangeChange} variant='outlined' />
      </Box>

      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Mã đơn`}</InputLabel>
        <TextField fullWidth value={state.code} placeholder={'Nhập mã đơn hàng'} onChange={(e) => handleChangeState(e.target.value, 'code')} />

      </Box>

      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Tên khách hàng`}</InputLabel>
        <TextField fullWidth value={state.name} placeholder={'Nhập tên khách hàng'} onChange={(e) => handleChangeState(e.target.value, 'name')} />
      </Box>

      <Box sx={{ p: 2, pb: 2 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Số điện thoại`}</InputLabel>
        <TextField fullWidth value={state.phoneNumber}  placeholder={'Nhập số điện thoại'} onChange={(e) => handleChangeState(e.target.value, 'phoneNumber')} />
        
      </Box>

      <Box sx={{ p: 2, pb: 2 }}>
        <MyButton
          size='small'
          variant='contained'
          sx={{ mt: 1, mb: 2, float: 'right' }}
          onClick={() => handleComfirm && handleComfirm(state)}
        >
          Xác nhận
        </MyButton>
        <MyButton
          size='small'
          variant='contained'
          color='warning'
          sx={{ mt: 1, mb: 2 }}
          onClick={() =>
            handleComfirm &&
            handleComfirm({
              name: '',
              phoneNumber: '',
              code: '',
              date: [null, null]
            })
          }
        >
          Bỏ lọc
        </MyButton>
      </Box>
    </PopperComponent>
  )
}
