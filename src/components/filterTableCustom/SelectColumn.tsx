import React, { useEffect, useState } from 'react'
import PopperComponent from '../popper'
import { Box } from '@mui/system'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import MyButton from '../button/MyButton'

interface Props {
  label?: string
  open: boolean
  list: Array<{ value: string; label: string }>
  value?: string
  anchorRef: React.RefObject<HTMLElement>
  handleComfirm?: (value: string) => void
  handleClose: (event: MouseEvent | TouchEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export default function SelectColumn(Props: Props) {
  const { list, value, open, label, anchorRef, handleClose, handleComfirm } = Props

  const [valueDefault, setValueDefault] = useState('')

  useEffect(() => {
    setValueDefault(value || '')
  }, [open])

  return (
    <PopperComponent clickAway open={open} anchorRef={anchorRef} handleClose={handleClose}>
      <Box sx={{ p: 2, pb: 2 }}>
        <FormControl>
          <FormLabel id='demo-radio-buttons-group-label'>{label || 'Vui lòng chọn'}</FormLabel>
          <RadioGroup
            aria-labelledby='demo-radio-buttons-group-label'
            value={valueDefault}
            onChange={(e) => {
              setValueDefault(e.target.value)
            }}
            name='radio-buttons-group'
          >
            {list.map((e, index) => (
              <FormControlLabel key={index} value={e.value} control={<Radio />} label={e.label} />
            ))}
          </RadioGroup>
          <MyButton
            size='small'
            variant='contained'
            sx={{ mt: 1 }}
            onClick={() => handleComfirm && handleComfirm(valueDefault)}
          >
            Xác nhận
          </MyButton>
        </FormControl>
      </Box>
    </PopperComponent>
  )
}
