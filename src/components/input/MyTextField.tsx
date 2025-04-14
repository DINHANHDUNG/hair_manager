// MyTextField.tsx
import React from 'react'
import TextField from '@mui/material/TextField'
import { Controller, Control, FieldErrors, FieldError } from 'react-hook-form'
import { FormControl, FormLabel } from '@mui/material'
import { COLORS } from '../../common/colors'
/* eslint-disable @typescript-eslint/no-explicit-any */
interface MyTextFieldProps {
  name: string
  control: Control<any> // Thay `any` bằng kiểu dữ liệu của form nếu có
  label?: string
  title?: string
  messageErrors?: string
  require?: boolean
  disabled?: boolean
  hideValue?: boolean
  errors: FieldErrors<any> // Thay `any` bằng kiểu dữ liệu của form nếu có
  [key: string]: any // Để chấp nhận các props khác nếu cần
}

const MyTextField: React.FC<MyTextFieldProps> = ({
  name,
  control,
  label,
  errors,
  title,
  require,
  disabled,
  messageErrors,
  hideValue,
  ...props
}) => {
  return (
    <FormControl fullWidth disabled={disabled}>
      {title && (
        <FormLabel
          sx={{ mb: 0.5, fontSize: '12px', color: !!errors[name] || !!messageErrors ? COLORS.red : COLORS.text }}
        >
          {title}
          <span style={{ color: COLORS.red }}>{require && ' *'}</span>
        </FormLabel>
      )}
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
            disabled={disabled}
            error={!!errors[name] || !!messageErrors}
            helperText={errors[name] ? (errors[name] as FieldError).message : messageErrors ? messageErrors : ''}
            {...props}
            value={hideValue && field.value ? '*'.repeat(String(field.value).length) : field.value} // Ẩn giá trị nếu hideValue = true
          />
        )}
      />
    </FormControl>
  )
}

export default MyTextField
