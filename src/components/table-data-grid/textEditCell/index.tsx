// components/editors/TextEditCell.tsx
import { TextField } from '@mui/material'
import { GridRenderEditCellParams } from '@mui/x-data-grid-pro'

export const TextEditCell = (params: GridRenderEditCellParams) => (
  <TextField
    fullWidth
    value={params.value ?? ''}
    onChange={(e) =>
      params.api.setEditCellValue({
        id: params.id,
        field: params.field,
        value: e.target.value
      })
    }
    error={params.error}
    helperText={params.error ? 'Không hợp lệ' : ''}
    variant='standard'
    autoFocus
  />
)
