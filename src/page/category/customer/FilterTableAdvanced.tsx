import { Autocomplete, InputLabel, TextField } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import MyButton from '../../../components/button/MyButton'
import PopperComponent from '../../../components/popper'
interface Props {
  listStaff: { value: string; label: string }[]
  label?: string
  open: boolean
  value?: { [field: string]: string }
  anchorRef: React.RefObject<HTMLElement>
  handleComfirm?: (value: StateFilterTableAdvanced) => void
  handleClose: (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

// Define the types for the state
export interface StateFilterTableAdvanced {
  staffId: string
}

export default function FilterTableAdvanced({ open, anchorRef, handleClose, handleComfirm, value, listStaff }: Props) {
  // const today = dayjs()

  const [state, setState] = useState<StateFilterTableAdvanced>({
    staffId: ''
  })

  useEffect(() => {
    if (open && value) {
      setState({
        staffId: value?.staffId.toString() || ''
      })
    }
  }, [open, value])

  const handleStaffChange = (_: React.SyntheticEvent, newValue: { value: string; label: string } | null) => {
    setState((prevState) => ({
      ...prevState,
      staffId: newValue?.value || ''
    }))
  }

  return (
    <PopperComponent clickAway open={open} anchorRef={anchorRef} handleClose={handleClose}>
      {/* <Box sx={{ p: 2, pb: 2 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>{`Số điện thoại`}</InputLabel>
        <TextField
          fullWidth
          value={state.statusOrder}
          placeholder={'Nhập số điện thoại'}
          onChange={(e) => handleChangeState(e.target.value, 'statusOrder')}
        />
        
      </Box> */}

      <Box sx={{ p: 2, pb: 0, width: 300 }}>
        <InputLabel sx={{ mb: 1 }} htmlFor={`input-Autocomplete`}>
          {`Nhân viên`}
        </InputLabel>
        <Autocomplete
          fullWidth
          options={listStaff}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
          onChange={handleStaffChange}
          value={
            state?.staffId
              ? {
                  value: state?.staffId,
                  label: listStaff?.find((opt) => opt.value === state.staffId)?.label || ''
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
              staffId: ''
            })
          }
        >
          Bỏ lọc
        </MyButton>
      </Box>
    </PopperComponent>
  )
}
