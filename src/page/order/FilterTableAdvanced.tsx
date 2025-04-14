import { Autocomplete, InputLabel, TextField, Typography } from '@mui/material'
import Slider, { SliderThumb } from '@mui/material/Slider'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import { DateRange } from '@mui/x-date-pickers-pro'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { STATUS_WORKING_EMPLOYEE } from '../../common/contants'
import MyButton from '../../components/button/MyButton'
import DateRangePickerShortCut from '../../components/dateTime/DateRangePickerShortCut'
import PopperComponent from '../../components/popper'

// eslint-disable-next-line
interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}

function AirbnbThumbComponent(props: AirbnbThumbComponentProps) {
  const { children, ...other } = props
  return (
    <SliderThumb {...other}>
      {children}
      <span className='airbnb-bar' />
      <span className='airbnb-bar' />
      <span className='airbnb-bar' />
    </SliderThumb>
  )
}

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: '#3a8589',
  height: 1,
  padding: '13px 0 0 0',
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)'
    },
    '& .airbnb-bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1
    }
  },
  '& .MuiSlider-track': {
    height: 3
  },
  '& .MuiSlider-rail': {
    color: theme.palette.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
    opacity: 1,
    height: 3
  },
  '& .MuiSlider-valueLabel': {
    fontSize: '12px',
    backgroundColor: 'transparent',
    color: '#000'
  }
}))

interface Props {
  label?: string
  open: boolean
  value?: { [field: string]: string }
  anchorRef: React.RefObject<HTMLElement>
  listCompany: { value: string; label: string }[]
  handleComfirm?: (value: StateFilterTableAdvanced) => void
  handleClose: (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

// Define the types for the state
export interface StateFilterTableAdvanced {
  company: string
  status: string
  age: number[]
  date: DateRange<Dayjs> | undefined
}

export default function FilterTableAdvanced({
  open,
  anchorRef,
  handleClose,
  handleComfirm,
  value,
  listCompany
}: Props) {
  const today = dayjs()

  const [state, setState] = useState<StateFilterTableAdvanced>({
    company: '',
    status: '',
    age: [0, 100],
    date: [today.startOf('month'), today.endOf('month')]
  })

  useEffect(() => {
    if (open && value) {
      setState({
        company: value?.companyId || '',
        status: value?.statusWorking || '',
        age: value.ageFrom && value.ageTo ? [Number(value.ageFrom), Number(value.ageTo)] : [18, 30],
        date:
          value.dateFrom && value.dateTo
            ? [dayjs(value.dateFrom), dayjs(value.dateTo)]
            : [today.startOf('month'), today.endOf('month')]
      })
    }
  }, [open, value])

  const handleCompanyChange = (_: React.SyntheticEvent, newValue: { value: string; label: string } | null) => {
    setState((prevState) => ({
      ...prevState,
      company: newValue?.value || ''
    }))
  }

  const handleStatusChange = (_: React.SyntheticEvent, newValue: { value: string; label: string } | null) => {
    setState((prevState) => ({
      ...prevState,
      status: newValue?.value || ''
    }))
  }

  const handleDateRangeChange = (newValue: DateRange<Dayjs> | undefined) => {
    setState((prevState) => ({
      ...prevState,
      date: newValue
    }))
  }

  const handleAgeChange = (_: Event, newValue: number | number[]) => {
    setState((prevState) => ({
      ...prevState,
      age: newValue as number[]
    }))
  }

  return (
    <PopperComponent clickAway open={open} anchorRef={anchorRef} handleClose={handleClose}>
      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel htmlFor={`input-DateRangePickerShortCut`}>{`Từ ngày đến ngày`}</InputLabel>
        <DateRangePickerShortCut value={state.date} setValue={handleDateRangeChange} variant='outlined' />
      </Box>

      <Box sx={{ p: 2, pb: 0 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Công ty`}</InputLabel>
        <Autocomplete
          options={listCompany}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
          onChange={handleCompanyChange}
          value={
            state.company
              ? {
                  value: state.company,
                  label: listCompany?.find((opt) => opt.value === state.company)?.label || ''
                }
              : null
          }
          renderInput={(params) => <TextField {...params} placeholder={'Vui lòng chọn'} />}
        />
      </Box>

      <Box sx={{ p: 2, pb: 2 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Trạng thái làm việc`}</InputLabel>
        <Autocomplete
          options={STATUS_WORKING_EMPLOYEE}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
          onChange={handleStatusChange}
          value={
            state.status
              ? {
                  value: state.status,
                  label: STATUS_WORKING_EMPLOYEE.find((opt) => opt.value === state.status)?.label || ''
                }
              : null
          }
          renderInput={(params) => <TextField {...params} placeholder={'Vui lòng chọn'} />}
        />
      </Box>

      <Box sx={{ p: 2, pb: 2 }}>
        <Typography gutterBottom>Độ tuổi</Typography>
        <Box sx={{ p: 2, pb: 2 }}>
          <AirbnbSlider
            slots={{ thumb: AirbnbThumbComponent }}
            getAriaLabel={(index) => (index === 0 ? 'Minimum age' : 'Maximum age')}
            value={state.age}
            valueLabelDisplay='on'
            sx={{ mt: 3 }}
            onChange={handleAgeChange}
          />
        </Box>

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
              company: '',
              status: '',
              age: [],
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
