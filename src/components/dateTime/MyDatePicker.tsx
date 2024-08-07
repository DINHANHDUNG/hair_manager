import { FormControl, TextFieldVariants } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'

type CustomDatePickerProps = Omit<DatePickerProps<Dayjs>, 'name' | 'value' | 'onChange' | 'onBlur'> & {
  error?: boolean
}
/* eslint-disable @typescript-eslint/no-explicit-any */
interface MyDatePickerProps extends CustomDatePickerProps {
  name: string
  control: Control<any>
  label: string
  errors: FieldErrors<any>
  defaultValue?: Dayjs
  format?: string
  mb?: number
  variant?: TextFieldVariants
}

const MyDatePicker: React.FC<MyDatePickerProps> = ({
  name,
  control,
  label,
  errors,
  defaultValue,
  format,
  mb,
  variant,
  ...props
}) => {
  const hasError = !!errors[name]

  return (
    <FormControl fullWidth sx={{ mb: mb }}>
      <LocalizationProvider adapterLocale='vi' dateAdapter={AdapterDayjs}>
        {/* <DemoContainer components={['DatePicker']}> */}
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue || null}
          render={({ field }) => (
            <DatePicker
              {...props}
              {...field}
              label={label}
              format={format || 'DD/MM/YYYY'}
              onChange={(value) => field.onChange(value || '')}
              value={field.value ? dayjs(field.value) : null}
              slotProps={{
                textField: {
                  error: hasError,
                  variant: variant || 'standard',
                  helperText: errors[name] ? (errors[name] as any).message : ''
                }
              }}
            />
          )}
        />
        {/* </DemoContainer> */}
      </LocalizationProvider>
    </FormControl>
  )
}

export default MyDatePicker
