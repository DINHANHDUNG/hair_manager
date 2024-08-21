// MyTextFieldSelect.tsx
import { FormControl, MenuItem, TextField, TextFieldProps } from '@mui/material'
import React from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
/* eslint-disable @typescript-eslint/no-explicit-any */
// Định nghĩa kiểu cho các props của MyTextFieldSelect
interface MyTextFieldSelectProps extends Omit<TextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur'> {
  name: string
  control: Control<any>
  label: string
  errors: FieldErrors<any>
  options: { value: string | number; label: string }[] // Danh sách tùy chọn
  mb?: number
  [key: string]: any
}

const MyTextFieldSelect: React.FC<MyTextFieldSelectProps> = ({
  name,
  control,
  label,
  errors,
  options,
  mb,
  ...props
}) => {
  const hasError = !!errors[name]

  return (
    <FormControl fullWidth error={!!errors[name]} sx={{ mb: mb }}>
      <Controller
        name={name as string}
        control={control}
        defaultValue=''
        render={({ field }) => (
          <TextField
            select
            {...field}
            label={label}
            {...props}
            variant='standard'
            error={hasError}
            helperText={errors[name] ? (errors[name] as any).message : ''}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: 200 // Adjust as needed
                  }
                }
              }
            }}
          >
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </FormControl>
  )
}

export default MyTextFieldSelect
