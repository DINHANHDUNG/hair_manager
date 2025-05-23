import { Autocomplete, InputLabel, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { DateRange } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { OPTIONS_STATUS_ORDER } from '../../common/contants'
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
  statusOrder: string
  statusManufacture: string
  code: string
  customerName: string
  dateReceive: DateRange<Dayjs> | undefined
  dateDelivery: DateRange<Dayjs> | undefined
}

export default function FilterTableAdvanced({ open, anchorRef, handleClose, handleComfirm, value }: Props) {
  // const today = dayjs()

  const [state, setState] = useState<StateFilterTableAdvanced>({
    dateReceive: [null, null],
    dateDelivery: [null, null],
    code: '',
    customerName: '',
    statusOrder: '',
    statusManufacture: ''
  })

  useEffect(() => {
    if (open && value) {
      setState({
        code: value?.code || '',
        customerName: value?.customerName || '',
        statusOrder: value?.statusOrder,
        statusManufacture: value?.statusManufacture,
        dateReceive:
          value.dateReceiveFrom && value.dateReceiveTo
            ? [dayjs(value.dateReceiveFrom), dayjs(value.dateReceiveTo)]
            : [null, null],
        dateDelivery:
          value.dateDeliveryFrom && value.dateDeliveryTo
            ? [dayjs(value.dateDeliveryFrom), dayjs(value.dateDeliveryTo)]
            : [null, null]
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
      dateReceive: newValue
    }))
  }

  const handleDateRangeDeliveryChange = (newValue: DateRange<Dayjs> | undefined) => {
    setState((prevState) => ({
      ...prevState,
      dateDelivery: newValue
    }))
  }

  const handleStatusChange = (_: React.SyntheticEvent, newValue: { value: string; label: string } | null) => {
    setState((prevState) => ({
      ...prevState,
      statusOrder: newValue?.value || ''
    }))
  }

  const handleStatusManufactureChange = (
    _: React.SyntheticEvent,
    newValue: { value: string; label: string } | null
  ) => {
    setState((prevState) => ({
      ...prevState,
      statusManufacture: newValue?.value || ''
    }))
  }

  return (
    <PopperComponent clickAway open={open} anchorRef={anchorRef} handleClose={handleClose}>
      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel htmlFor={`input-DateRangePickerShortCut`}>{`Từ ngày đến ngày (Ngày nhận)`}</InputLabel>
        <DateRangePickerShortCut
          value={state.dateReceive}
          setValue={handleDateRangeChange}
          variant='outlined'
          size='small'
        />
      </Box>
      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel htmlFor={`input-DateRangePickerShortCut`}>{`Từ ngày đến ngày (Ngày giao)`}</InputLabel>
        <DateRangePickerShortCut
          value={state.dateDelivery}
          setValue={handleDateRangeDeliveryChange}
          variant='outlined'
          size='small'
        />
      </Box>

      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Mã đơn`}</InputLabel>
        <TextField
          fullWidth
          value={state.code}
          placeholder={'Nhập mã đơn hàng'}
          onChange={(e) => handleChangeState(e.target.value, 'code')}
          size='small'
        />
      </Box>

      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Tên khách hàng`}</InputLabel>
        <TextField
          fullWidth
          value={state.customerName}
          placeholder={'Nhập tên khách hàng'}
          onChange={(e) => handleChangeState(e.target.value, 'customerName')}
          size='small'
        />
      </Box>

      {/* <Box sx={{ p: 2, pb: 2 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Số điện thoại`}</InputLabel>
        <TextField
          fullWidth
          value={state.statusOrder}
          placeholder={'Nhập số điện thoại'}
          onChange={(e) => handleChangeState(e.target.value, 'statusOrder')}
        />
        
      </Box> */}

      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>
          {`Trạng thái bán hàng`}
        </InputLabel>
        <Autocomplete
          options={OPTIONS_STATUS_ORDER}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
          onChange={handleStatusChange}
          value={
            state.statusOrder
              ? {
                  value: state.statusOrder,
                  label: OPTIONS_STATUS_ORDER.find((opt) => opt.value === state.statusOrder)?.label || ''
                }
              : null
          }
          renderInput={(params) => <TextField {...params} placeholder={'Vui lòng chọn'} />}
          size='small'
        />
      </Box>

      <Box sx={{ p: 2, pb: 2 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>
          {`Trạng thái sản xuất`}
        </InputLabel>
        <Autocomplete
          options={OPTIONS_STATUS_ORDER}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
          onChange={handleStatusManufactureChange}
          value={
            state.statusManufacture
              ? {
                  value: state.statusManufacture,
                  label: OPTIONS_STATUS_ORDER.find((opt) => opt.value === state.statusManufacture)?.label || ''
                }
              : null
          }
          renderInput={(params) => <TextField {...params} placeholder={'Vui lòng chọn'} />}
          size='small'
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
              customerName: '',
              statusOrder: '',
              statusManufacture: '',
              code: '',
              dateReceive: [null, null],
              dateDelivery: [null, null]
            })
          }
        >
          Bỏ lọc
        </MyButton>
      </Box>
    </PopperComponent>
  )
}
