import { FormControl } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TimeField, TimeFieldProps } from '@mui/x-date-pickers/TimeField'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'

type CustomTimeFieldProps = Omit<TimeFieldProps<Dayjs, boolean>, 'name' | 'value' | 'onChange' | 'onBlur'> & {
  error?: boolean
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// Định nghĩa kiểu cho các props của MyTimeField
interface MyTimeFieldProps extends CustomTimeFieldProps {
  name: string
  control: Control<any>
  label: string
  errors: FieldErrors<any>
  defaultValue?: Dayjs
  format?: string
  mb?: number
}

const MyTimeField: React.FC<MyTimeFieldProps> = ({
  name,
  control,
  label,
  errors,
  defaultValue,
  format,
  mb,
  ...props
}) => {
  const hasError = !!errors[name]

  return (
    <FormControl fullWidth sx={{ mb: mb }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <TimeField
              {...props}
              {...field}
              label={label}
              format={format || 'HH:mm'}
              onChange={(value: any) => field.onChange(value || '')}
              value={field.value ? dayjs(field.value) : null}
              helperText={(errors[name] as any)?.message}
              slotProps={{
                textField: { error: hasError }
              }}
            />
          )}
        />
      </LocalizationProvider>
    </FormControl>
  )
}

export default MyTimeField
