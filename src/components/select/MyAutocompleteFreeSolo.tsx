import { Autocomplete, AutocompleteProps, FormControl, FormLabel, TextField, TextFieldProps } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { COLORS } from '../../common/colors';

type OptionType = { label: string; value: string }

type CustomAutocompleteProps<T> = Omit<
  AutocompleteProps<T, boolean, boolean, boolean>,
  'name' | 'value' | 'onChange' | 'onBlur' | 'renderInput'
> & {
  options: OptionType[] | string[]
}
/* eslint-disable @typescript-eslint/no-explicit-any */
interface MyAutocompleteFreeSoloProps<T> extends CustomAutocompleteProps<T> {
  name: string
  title?: string
  require?: boolean
  control: Control<any> //FormValues
  label?: string
  errors: FieldErrors<any> //FormValues
  defaultValue?: T
  mb?: number
  freeSolo?: boolean
  messageErrors?: string
  placeholder?: string
  disabled?: boolean
  hideValue?: boolean,
  textFieldProps?: TextFieldProps
  onChange?: (event: React.ChangeEvent<any>, value: T | null) => void
}

const MyAutocompleteFreeSolo = <T extends OptionType>({
  name,
  control,
  label,
  errors,
  defaultValue,
  mb,
  freeSolo = true,
  textFieldProps,
  options,
  onChange,
  title,
  require,
  hideValue,
  placeholder,
  messageErrors,
  disabled,
  ...props
}: MyAutocompleteFreeSoloProps<T>) => {
  const hasError = !!errors[name]

  return (
    <FormControl fullWidth sx={{ mb: mb }}>
      {title && (
        <FormLabel sx={{ mb: 0.5, fontSize: '12px', color: COLORS.text }}>
          {title}
          <span style={{ color: COLORS.red }}>{require && ' *'}</span>
        </FormLabel>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || ''}
        render={({ field }) => (
          <Autocomplete
            {...props}
            {...field}
            freeSolo={freeSolo}
            options={options}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label || '')}
            disabled={disabled}
            onChange={(event, value) => {
              if (onChange) {
                return onChange(event, value as T | null)
              }
              field.onChange(value ? value : '')
            }}
            onInputChange={(_, value) => field?.onChange(value)}
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
    </FormControl>
  )
}

export default MyAutocompleteFreeSolo
