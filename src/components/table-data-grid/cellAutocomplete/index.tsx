import { Autocomplete, TextField } from '@mui/material'
import { GridRenderEditCellParams } from '@mui/x-data-grid-pro'

interface Option {
  label: string
  value: string
}

interface AutocompleteEditCellProps extends GridRenderEditCellParams {
  options: Option[]
}

export const AutocompleteEditCell = (params: AutocompleteEditCellProps) => {
  const { value, options } = params

  const selectedOption = options.find((opt) => opt.value === value) || null

  return (
    <Autocomplete
      fullWidth
      autoHighlight
      options={options}
      value={selectedOption}
      onChange={(_, newValue) =>
        params.api.setEditCellValue({
          id: params.id,
          field: params.field,
          value: newValue ? newValue.value : ''
        })
      }
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      renderInput={(paramsInput) => <TextField {...paramsInput} autoFocus variant='standard' />}
    />
  )
}
