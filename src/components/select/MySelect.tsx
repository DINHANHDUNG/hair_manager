// MySelect.tsx
import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  TextFieldVariants,
  Typography
} from '@mui/material'
import React from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { COLORS } from '../../common/colors'
/* eslint-disable @typescript-eslint/no-explicit-any */
// Định nghĩa kiểu cho các props của MySelect
interface MySelectProps extends Omit<SelectProps<any>, 'name' | 'value' | 'onChange' | 'onBlur'> {
  name: string
  control: Control<any>
  label?: string
  title?: string
  require?: boolean
  errors: FieldErrors<any>
  options: { value: string | number; label: string }[] // Danh sách tùy chọn
  mb?: number
  variant?: TextFieldVariants
  placeholder?: string
  messageErrors?: string
  none?: boolean
  keyNone?: string
  hideValue?: boolean
}

const MySelect: React.FC<MySelectProps> = ({
  name,
  control,
  label,
  errors,
  options,
  mb,
  variant,
  title,
  require,
  placeholder,
  messageErrors,
  none,
  keyNone,
  hideValue,
  ...props
}) => {
  return (
    <FormControl variant={variant || 'standard'} fullWidth error={!!errors[name] || !!messageErrors} sx={{ mb: mb }}>
      {/* <FormLabel>Options</FormLabel> */}
      <InputLabel id='demo-simple-select-standard-label'>{label}</InputLabel>
      {title && (
        <FormLabel sx={{ mb: 0.5, fontSize: '12px', color: COLORS.text }}>
          {title}
          <span style={{ color: COLORS.red }}>{require && ' *'}</span>
        </FormLabel>
      )}
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
            placeholder={placeholder}
            {...props}
            displayEmpty
            renderValue={(value: any) => {
              if (!value) {
                return (
                  <Typography color='#8080806e' variant='h5' sx={{ mt: '1px' }}>
                    {placeholder || ''}
                  </Typography>
                )
              }
              const selectedOption = options.find((option) => option.value === value)
              // return selectedOption ? selectedOption.label : value // Hiển thị nhãn hoặc giá trị nếu không tìm thấy
              return hideValue
                ? '*'.repeat(selectedOption?.label.length || 0)
                : selectedOption
                  ? selectedOption?.label
                  : value
            }}
          >
            {!none && (
              <MenuItem value=''>
                <em>{keyNone ? keyNone : 'None'}</em>
              </MenuItem>
            )}

            {options?.map((option) => (
              <MenuItem key={option.value} value={option?.value}>
                {option?.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors[name] && <FormHelperText sx={{ mt: 0.5, mb: mb }}>{(errors[name] as any).message}</FormHelperText>}
      {messageErrors && <FormHelperText sx={{ mt: 0.5, mb: mb }}>{messageErrors}</FormHelperText>}
    </FormControl>
  )
}

export default MySelect
