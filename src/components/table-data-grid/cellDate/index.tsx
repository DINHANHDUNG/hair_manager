// components/editors/DateEditCell.tsx
import dayjs from 'dayjs'
import { GridRenderEditCellParams } from '@mui/x-data-grid-pro'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export const DateEditCell = (params: GridRenderEditCellParams) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      value={params.value ? dayjs(params.value) : null}
      format={'DD/MM/YYYY'}
      onChange={(newValue) =>
        params.api.setEditCellValue({
          id: params.id,
          field: params.field,
          value: newValue?.toISOString() || null
        })
      }
    />
  </LocalizationProvider>
)
