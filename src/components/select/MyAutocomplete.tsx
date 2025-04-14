import { Autocomplete, AutocompleteProps, FormControl, FormLabel, TextField, TextFieldProps } from '@mui/material'
import { SxProps } from '@mui/system'
import React from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { COLORS } from '../../common/colors'

// Xác định kiểu cho các tùy chọn trong Autocomplete
interface OptionType {
  value: string | number
  label: string
}
/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomAutocompleteProps = Omit<AutocompleteProps<OptionType, boolean, false, false>, 'renderInput'> & {
  freeSolo?: any
  onChange?: (e: React.SyntheticEvent<Element, Event>, v: OptionType) => void // Hàm onChange tùy chỉnh
}

// Định nghĩa kiểu cho các props của MyAutocomplete
interface MyAutocompleteProps extends CustomAutocompleteProps {
  name: string
  control: Control<any>
  label?: string
  title?: string
  require?: boolean
  errors: FieldErrors<any>
  options: OptionType[] // Danh sách tùy chọn
  textFieldProps?: TextFieldProps // Props bổ sung cho TextField
  isOptionEqualToValue?: (option: OptionType, value: OptionType) => boolean // Hàm so sánh tùy chọn
  renderOption?: (props: React.HTMLProps<HTMLElement>, option: OptionType) => JSX.Element
  sx?: SxProps // Props bổ sung cho style,
  placeholder?: string
  messageErrors?: string
  disabled?: boolean
  hideValue?: boolean
  // onChange?: (value: OptionType | null) => void // Hàm onChange tùy chỉnh
}

const MyAutocomplete: React.FC<MyAutocompleteProps> = ({
  name,
  control,
  label,
  errors,
  options,
  textFieldProps,
  sx,
  isOptionEqualToValue,
  renderOption,
  freeSolo,
  title,
  require,
  placeholder,
  messageErrors,
  onChange,
  disabled,
  hideValue,
  ...props
}) => {
  return (
    <FormControl disabled={disabled} fullWidth error={!!errors[name] || !!messageErrors} sx={sx}>
      {title && (
        <FormLabel sx={{ mb: 0.5, fontSize: '12px', color: COLORS.text }}>
          {title}
          <span style={{ color: COLORS.red }}>{require && ' *'}</span>
        </FormLabel>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue=''
        // defaultValue={null}
        render={({ field }) => (
          <Autocomplete
            {...field}
            freeSolo={freeSolo}
            options={options}
            getOptionLabel={(option: OptionType | string) => {
              if (hideValue) {
                const label =
                  typeof option === 'string'
                    ? options.find((e: OptionType) => e?.value === option)?.label || ''
                    : option?.label || ''
                return '*'.repeat(label.length) // Hiển thị số lượng * tương ứng với độ dài label
              }
              // if (hideValue) return '*************' // Nếu hideValue = true, luôn hiển thị dấu *
              return typeof option === 'string'
                ? options.find((e: OptionType) => e?.value === option)?.label || ''
                : option?.label || ''
            }}
            disabled={disabled}
            onChange={(e, value) => {
              if (onChange) {
                return onChange(e, value as OptionType) // Gọi onChange tùy chỉnh nếu có
              }
              field?.onChange(value)
            }}
            isOptionEqualToValue={
              isOptionEqualToValue
                ? isOptionEqualToValue
                : (option, value) => {
                    // if (Array.isArray(value)) {
                    //   // So sánh từng phần tử trong mảng value
                    //   return value.some((val) => val === option.value)
                    // }
                    if (typeof value === 'string') {
                      return option.value.toString() === value // So sánh chuỗi
                    }
                    return option.value === value?.value // So sánh object (nếu value là object)
                  }
            }
            renderOption={renderOption}
            autoSelect={true}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!errors[name] || !!messageErrors}
                helperText={errors[name] ? (errors[name] as any).message : messageErrors ? messageErrors : ''}
                {...textFieldProps}
                disabled={disabled}
              />
            )}
            {...props}
          />
        )}
      />
      {/* {errors[name] && <FormHelperText>{(errors[name] as any).message}</FormHelperText>} */}
    </FormControl>
  )
}

export default MyAutocomplete
