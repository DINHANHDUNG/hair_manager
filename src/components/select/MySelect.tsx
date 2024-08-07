// MySelect.tsx
import React from 'react'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectProps,
  TextFieldVariants
} from '@mui/material'
/* eslint-disable @typescript-eslint/no-explicit-any */
// Định nghĩa kiểu cho các props của MySelect
interface MySelectProps extends Omit<SelectProps<any>, 'name' | 'value' | 'onChange' | 'onBlur'> {
  name: string
  control: Control<any>
  label: string
  errors: FieldErrors<any>
  options: { value: string | number; label: string }[] // Danh sách tùy chọn
  mb?: number
  variant?: TextFieldVariants
}

const MySelect: React.FC<MySelectProps> = ({ name, control, label, errors, options, mb, variant, ...props }) => {
  return (
    <FormControl variant={variant || 'standard'} fullWidth error={!!errors[name]} sx={{ mb: mb }}>
      <InputLabel id='demo-simple-select-standard-label'>{label}</InputLabel>
      <Controller
        name={name as string}
        control={control}
        defaultValue=''
        render={({ field }) => (
          <Select
            id='demo-simple-select-standard'
            labelId='demo-simple-select-standard-label'
            {...field}
            label={label}
            {...props}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {options?.map((option) => (
              <MenuItem key={option.value} value={option?.value}>
                {option?.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors[name] && <FormHelperText sx={{ mt: 0.5, mb: mb }}>{(errors[name] as any).message}</FormHelperText>}
    </FormControl>
  )
}

export default MySelect
