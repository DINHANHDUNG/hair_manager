import { Autocomplete, AutocompleteProps, FormControl, TextField, TextFieldProps } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'

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
  control: Control<any> //FormValues
  label: string
  errors: FieldErrors<any> //FormValues
  defaultValue?: T
  mb?: number
  freeSolo?: boolean
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
  ...props
}: MyAutocompleteFreeSoloProps<T>) => {
  const hasError = !!errors[name]

  return (
    <FormControl fullWidth sx={{ mb: mb }}>
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
            onChange={(event, value) => {
              if (onChange) {
                return onChange(event, value as T | null)
              }
              field.onChange(value ? value : '')
            }}
            onInputChange={(_, value) => field.onChange(value)}
            renderInput={(params) => (
              <TextField
                {...textFieldProps}
                {...params}
                label={label}
                error={hasError}
                helperText={errors[name] ? (errors[name] as any).message : ''}
              />
            )}
          />
        )}
      />
    </FormControl>
  )
}

export default MyAutocompleteFreeSolo
