import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { GridRenderHeaderFilterProps } from '@mui/x-data-grid-pro'

export const CustomSelectFilterDataGrid = ({
  colDef,
  filterValue,
  onFilterChange,
  data
}: GridRenderHeaderFilterProps & {
  filterValue: string
  onFilterChange: (field: string, value: string) => void
  data: Array<{ value: string; label: string }>
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onFilterChange(colDef.field, event.target.value)
  }

  return (
    <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }} fullWidth>
      {/* <InputLabel id={`select-${colDef.field}-label`}>{`${colDef.headerName || colDef.field}`}</InputLabel> */}
      <Select
        labelId={`select-${colDef.field}-label`}
        id={`select-${colDef.field}`}
        value={filterValue}
        onChange={handleChange}
      >
        <MenuItem value=''>
          <em>None</em>
        </MenuItem>
        {data.map((e) => (
          <MenuItem value={e.value}>{e.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
