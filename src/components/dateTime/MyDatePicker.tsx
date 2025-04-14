import { FormControl, FormLabel, TextFieldVariants } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import moment from 'moment'
import React, { ReactNode } from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { COLORS } from '../../common/colors'

moment.updateLocale('vi', {
  // Default value from moment
  // weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),

  // New value
  weekdaysShort: ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'CN']
})
/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomDateTimePickerProps = Omit<
  DatePickerProps<Dayjs> & DateTimePickerProps<Dayjs>,
  'name' | 'value' | 'onChange' | 'onBlur'
> & {
  error?: boolean
}

interface MyDatePickerProps extends CustomDateTimePickerProps {
  name: string
  control: Control<any>
  label?: string
  title?: string | ReactNode
  require?: boolean
  errors: FieldErrors<any>
  defaultValue?: Dayjs
  format?: string
  mb?: number
  variant?: TextFieldVariants
  size?: 'medium' | 'small'
  placeholder?: string
  time?: boolean
  messageErrors?: string
  hideValue?: boolean
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
  size,
  title,
  require,
  placeholder,
  time,
  messageErrors,
  // hideValue,
  ...props
}) => {
  const hasError = !!errors[name] || !!messageErrors

  return (
    <FormControl fullWidth sx={{ mb: mb }}>
      <LocalizationProvider adapterLocale='vi' dateAdapter={AdapterDayjs}>
        {title && (
          <FormLabel sx={{ mb: 0.5, fontSize: '12px', color: hasError ? COLORS.red : COLORS.text }}>
            {title}
            <span style={{ color: COLORS.red }}>{require && ' *'}</span>
          </FormLabel>
        )}
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue || null}
          render={({ field }) =>
            time ? (
              <DateTimePicker
                // slots={{
                //   openPickerIcon: () => <RiCalendarEventLine size={20} />
                // }}
                {...props}
                {...field}
                label={label}
                dayOfWeekFormatter={(date: dayjs.Dayjs) => {
                  const weekdays = ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy']
                  return weekdays[date.day()]
                }}
                format={format || 'DD/MM/YYYY HH:mm'}
                onChange={(value) => field.onChange(value || null)}
                value={field.value ? dayjs(field.value) : null}
                slotProps={{
                  textField: {
                    size: size || 'small',
                    error: hasError,
                    variant: variant || 'standard',
                    placeholder: placeholder,
                    helperText: errors[name] ? (errors[name] as any).message : messageErrors ? messageErrors : ''
                    // value: hideValue ? '********' : field.value ? dayjs(field.value).toString() : ''
                  }
                }}
              />
            ) : (
              <DatePicker
                // slots={{
                //   openPickerIcon: () => <RiCalendarEventLine size={20} />
                // }}
                {...props}
                {...field}
                label={label}
                dayOfWeekFormatter={(date: dayjs.Dayjs) => {
                  const weekdays = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7']
                  return weekdays[date.day()]
                }}
                format={format || 'DD/MM/YYYY'}
                onChange={(value) => field.onChange(value || null)}
                value={field.value ? dayjs(field.value) : null}
                slotProps={{
                  textField: {
                    size: size || 'small',
                    error: hasError,
                    variant: variant || 'standard',
                    placeholder: placeholder,
                    helperText: errors[name] ? (errors[name] as any).message : messageErrors ? messageErrors : ''
                    // value: hideValue ? '********' : field.value ? dayjs(field.value).toString() : ''
                  }
                }}
              />
            )
          }
        />
      </LocalizationProvider>
    </FormControl>
  )
}

export default MyDatePicker
/* eslint-enable @typescript-eslint/no-explicit-any */
