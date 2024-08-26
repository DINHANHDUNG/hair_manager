import { Autocomplete, InputLabel, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { DateRange } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { STATUS_ADVANCE_SALARY } from '../../../../common/contants'
import MyButton from '../../../../components/button/MyButton'
import DateRangePickerShortCut from '../../../../components/dateTime/DateRangePickerShortCut'
import PopperComponent from '../../../../components/popper'

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
  statusRefund: string
  date: DateRange<Dayjs> | undefined
}

export default function FilterTableAdvanced({ open, anchorRef, handleClose, handleComfirm, value }: Props) {
  const today = dayjs()

  const [state, setState] = useState<StateFilterTableAdvanced>({
    statusRefund: '',
    date: [today.startOf('month'), today.endOf('month')]
  })

  useEffect(() => {
    if (open && value) {
      setState({
        statusRefund: value?.statusRefund || '',
        date:
          value.dateFrom && value.dateTo
            ? [dayjs(value.dateFrom), dayjs(value.dateTo)]
            : [today.startOf('month'), today.endOf('month')]
      })
    }
  }, [open, value])

  // const handleIsRefundChange = (_: React.SyntheticEvent, newValue: { value: string; label: string } | null) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     isRefund: newValue?.value || ''
  //   }))
  // }

  const handleStatusChange = (_: React.SyntheticEvent, newValue: { value: string; label: string } | null) => {
    setState((prevState) => ({
      ...prevState,
      statusRefund: newValue?.value || ''
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

      <Box sx={{ p: 2, pb: 2 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Trạng thái ứng lương`}</InputLabel>
        <Autocomplete
          options={STATUS_ADVANCE_SALARY}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
          onChange={handleStatusChange}
          value={
            state.statusRefund
              ? {
                  value: state.statusRefund,
                  label: STATUS_ADVANCE_SALARY.find((opt) => opt.value === state.statusRefund)?.label || ''
                }
              : null
          }
          renderInput={(params) => <TextField {...params} placeholder={'Vui lòng chọn'} />}
        />
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
              statusRefund: '',
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
