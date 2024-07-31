import {
  DataGridPro,
  GridCallbackDetails,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowSelectionModel,
  GridRowsProp
} from '@mui/x-data-grid-pro'
import React from 'react'
import CustomToolbar from './CustomToolbarDataGrid'

interface TableDataGridProps {
  data?: Record<string, unknown> // Dữ liệu không xác định cụ thể, tránh dùng any
  columns: GridColDef[]
  rows: GridRowsProp
  isLoading: boolean
  paginationModel: GridPaginationModel
  setPaginationModel: (model: GridPaginationModel, details: GridCallbackDetails) => void
  onRowSelectionChange?: (model: GridRowSelectionModel, details: GridCallbackDetails) => void
  onFilterChange?: (model: GridFilterModel, details: GridCallbackDetails) => void
  otherProps?: Record<string, unknown> // Các props bổ sung không xác định cụ thể
  pageSizeOptions?: number[]
  searchValue?: string
  filterMode?: 'server' | 'client'
  headerFilters?: boolean
  checkboxSelection?: boolean
  handleSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const TableDataGrid: React.FC<TableDataGridProps> = ({
  //   data,
  columns,
  rows,
  isLoading,
  paginationModel,
  setPaginationModel,
  onRowSelectionChange,
  onFilterChange,
  pageSizeOptions,
  searchValue,
  handleSearchChange,
  checkboxSelection,
  headerFilters,
  filterMode,
  otherProps // Các props bổ sung
}) => {
  return (
    <DataGridPro
      //   {...data}
      checkboxSelection={checkboxSelection}
      headerFilters={headerFilters}
      onRowSelectionModelChange={onRowSelectionChange}
      columns={columns}
      disableColumnFilter
      rows={rows}
      filterMode={filterMode || 'server'}
      onFilterModelChange={onFilterChange}
      loading={isLoading}
      pageSizeOptions={pageSizeOptions || [10, 20, 50]}
      paginationModel={paginationModel}
      paginationMode='server'
      pagination
      onPaginationModelChange={setPaginationModel}
      rowCount={rows.length || 0}
      localeText={{
        MuiTablePagination: {
          labelDisplayedRows,
          labelRowsPerPage: 'Số bản ghi'
        },
        footerRowSelected: (count) => `Đã chọn ${count}`
      }}
      sx={{
        '.MuiDataGrid-columnSeparator': {
          display: 'none'
        },
        '&.MuiDataGrid-root': {
          border: 'none'
        },
        '& .super-app-theme--header': {
          backgroundColor: 'red'
        }
      }}
      slots={{
        toolbar: () => (
          <CustomToolbar
            onSearchChange={(e) => handleSearchChange && handleSearchChange(e)}
            searchValue={searchValue || ''}
          />
        )
      }}
      //   slotProps={{
      //     toolbar: {
      //       searchValue: searchValue,
      //       onSearchChange: handleSearchChange
      //     }
      //   }}
      {...otherProps} // Truyền các props bổ sung vào đây
    />
  )
}

export default TableDataGrid

const labelDisplayedRows = ({
  from,
  to,
  count,
  estimated
}: {
  from: number
  to: number
  count: number
  estimated?: number
}) => {
  if (!estimated) return `${from}–${to} của ${count !== -1 ? count : `više nego ${to}`}`
  return `${from}–${to} của ${count !== -1 ? count : `više nego ${estimated > to ? estimated : to}`}`
}
