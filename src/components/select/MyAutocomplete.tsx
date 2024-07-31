import { Autocomplete, AutocompleteProps, FormControl, TextField, TextFieldProps } from '@mui/material'
import { SxProps } from '@mui/system'
import React from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'

// Xác định kiểu cho các tùy chọn trong Autocomplete
interface OptionType {
  value: string | number
  label: string
}
/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomAutocompleteProps = Omit<AutocompleteProps<OptionType, boolean, false, false>, 'renderInput'> & {
  freeSolo?: any
}

// Định nghĩa kiểu cho các props của MyAutocomplete
interface MyAutocompleteProps extends CustomAutocompleteProps {
  name: string
  control: Control<any>
  label: string
  errors: FieldErrors<any>
  options: OptionType[] // Danh sách tùy chọn
  textFieldProps?: TextFieldProps // Props bổ sung cho TextField
  getOptionSelected?: (option: OptionType, value: OptionType) => boolean // Hàm so sánh tùy chọn
  renderOption?: (props: React.HTMLProps<HTMLElement>, option: OptionType) => JSX.Element
  sx?: SxProps // Props bổ sung cho style
}

const MyAutocomplete: React.FC<MyAutocompleteProps> = ({
  name,
  control,
  label,
  errors,
  options,
  textFieldProps,
  sx,
  getOptionSelected,
  renderOption,
  freeSolo,
  ...props
}) => {
  return (
    <FormControl fullWidth error={!!errors[name]} sx={sx}>
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <Autocomplete
            {...field}
            freeSolo={freeSolo}
            options={options}
            getOptionLabel={(option) => option.label || ''}
            onChange={(_, value) => {
              field.onChange(value)
            }}
            isOptionEqualToValue={getOptionSelected}
            renderOption={renderOption}
            autoSelect={true}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                error={!!errors[name]}
                helperText={errors[name] ? (errors[name] as any).message : ''}
                {...textFieldProps}
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
