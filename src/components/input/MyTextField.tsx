// MyTextField.tsx
import React from 'react'
import TextField from '@mui/material/TextField'
import { Controller, Control, FieldErrors, FieldError } from 'react-hook-form'
/* eslint-disable @typescript-eslint/no-explicit-any */
interface MyTextFieldProps {
  name: string
  control: Control<any> // Thay `any` bằng kiểu dữ liệu của form nếu có
  label: string
  errors: FieldErrors<any> // Thay `any` bằng kiểu dữ liệu của form nếu có
  [key: string]: any // Để chấp nhận các props khác nếu cần
}

const MyTextField: React.FC<MyTextFieldProps> = ({ name, control, label, errors, ...props }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=''
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          variant='standard'
          fullWidth
          error={!!errors[name]}
          helperText={errors[name] ? (errors[name] as FieldError).message : ''}
          {...props}
        />
      )}
    />
  )
}

export default MyTextField
