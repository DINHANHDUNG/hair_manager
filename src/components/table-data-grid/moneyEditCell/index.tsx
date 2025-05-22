import { TextField } from '@mui/material'
import { GridRenderEditCellParams } from '@mui/x-data-grid-pro'
import { NumericFormat } from 'react-number-format'

export const MoneyEditCell = (params: GridRenderEditCellParams) => {
  return (
    <NumericFormat
      customInput={TextField}
      fullWidth
      autoFocus
      variant='standard'
      value={params.value ?? ''}
      onValueChange={(values) => {
        params.api.setEditCellValue({
          id: params.id,
          field: params.field,
          value: values.value
        })
      }}
      thousandSeparator
      valueIsNumericString
      error={params.error}
      helperText={params.error ? 'Không hợp lệ' : ''}
    />
  )
}
