import { FormControl, TextField } from '@mui/material'
import { GridRenderHeaderFilterProps } from '@mui/x-data-grid-pro'
import React from 'react'

export const CustomInputFilterDataGrid = ({
  colDef,
  filterValue,
  onFilterChange,
  type
}: GridRenderHeaderFilterProps & {
  filterValue: string
  onFilterChange: (field: string, value: string) => void
  type?: string
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(colDef.field, event.target.value)
  }

  return (
    <FormControl variant='standard' sx={{ minWidth: 120 }} fullWidth>
      {/* <InputLabel htmlFor={`input-${colDef.field}`}>{`Lọc ${colDef.headerName || colDef.field}`}</InputLabel> */}
      <TextField
        id={`input-${colDef.field}`}
        value={filterValue}
        onChange={handleChange}
        placeholder={colDef.headerName || colDef.field}
        variant='standard'
        type={type || 'text'}
        size='small'
        fullWidth
      />
    </FormControl>
  )
}

export default CustomInputFilterDataGrid
