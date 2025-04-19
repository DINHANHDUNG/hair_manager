// components/editors/TextareaEditCell.tsx
import { TextField } from '@mui/material'
import { GridRenderEditCellParams } from '@mui/x-data-grid-pro'

export const TextareaEditCell = (params: GridRenderEditCellParams) => (
  <TextField
    fullWidth
    multiline
    value={params.value ?? ''}
    onChange={(e) =>
      params.api.setEditCellValue({
        id: params.id,
        field: params.field,
        value: e.target.value
      })
    }
    variant='standard'
  />
)
