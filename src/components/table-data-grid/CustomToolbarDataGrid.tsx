import React from 'react'
import { GridToolbarContainer } from '@mui/x-data-grid-pro'
import { FormControl, OutlinedInput, Theme, useMediaQuery } from '@mui/material'
import IconSearch from '@mui/icons-material/Search'

interface CustomToolbarProps {
  searchValue: string
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ searchValue, onSearchChange }) => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <GridToolbarContainer>
      <FormControl fullWidth sx={{ m: 1, width: downMD ? '100%' : '50%' }} variant='filled'>
        <OutlinedInput
          size='small'
          id='search-input'
          startAdornment={<IconSearch sx={{ mr: 1 }} />}
          placeholder='Tìm kiếm'
          value={searchValue}
          onChange={onSearchChange}
        />
      </FormControl>
    </GridToolbarContainer>
  )
}

export default CustomToolbar
