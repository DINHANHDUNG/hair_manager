import { styled } from '@mui/system'
import {
  DataGridPro,
  GridAutosizeOptions,
  GridCallbackDetails,
  gridClasses,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp,
  MuiEvent
} from '@mui/x-data-grid-pro'
import React, { ReactElement } from 'react'
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
  toolbarEnable?: boolean
  toolbar?: ReactElement
  onRowClick?: (
    params: GridRowParams, // GridRowParams
    event: MuiEvent<React.MouseEvent<HTMLElement>>, // MuiEvent<React.MouseEvent<HTMLElement>>
    details: GridCallbackDetails // GridCallbackDetails
  ) => void
}

const autosizeOptions: GridAutosizeOptions = {
  includeOutliers: true
}

const TableDataGrid: React.FC<TableDataGridProps> = ({
  //   data,
  columns,
  rows,
  isLoading,
  paginationModel,
  setPaginationModel,
  onRowSelectionChange,
  onRowClick,
  onFilterChange,
  pageSizeOptions,
  searchValue,
  handleSearchChange,
  checkboxSelection,
  headerFilters,
  filterMode,
  toolbarEnable,
  toolbar,
  otherProps // Các props bổ sung
}) => {
  return (
    <DataGridPro
      //   {...data}
      autoHeight
      checkboxSelection={checkboxSelection}
      headerFilters={headerFilters}
      onRowSelectionModelChange={onRowSelectionChange}
      onRowClick={onRowClick}
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
      getRowHeight={() => 'auto'}
      onPaginationModelChange={setPaginationModel}
      autosizeOptions={autosizeOptions}
      rowCount={rows.length || 0}
      localeText={{
        MuiTablePagination: {
          labelDisplayedRows,
          labelRowsPerPage: 'Số bản ghi'
        },

        footerRowSelected: (count) => (checkboxSelection ? `Đã chọn ${count}` : '')
      }}
      disableColumnReorder={true} //Tắt di chuyển cột
      sx={{
        '.MuiDataGrid-columnSeparator': {
          display: 'none'
        },
        '&.MuiDataGrid-root': {
          border: 'none'
        },
        [`& .${gridClasses.cell}`]: {
          py: 1
        }
      }}
      slots={{
        // headerFilterMenu: null,
        toolbar: () =>
          toolbarEnable ? (
            toolbar ? (
              toolbar
            ) : (
              <CustomToolbar
                onSearchChange={(e) => handleSearchChange && handleSearchChange(e)}
                searchValue={searchValue || ''}
              />
            )
          ) : (
            <></>
          )
      }}
      // slotProps={{
      //   toolbar: {
      //     searchValue: searchValue,
      //     onSearchChange: handleSearchChange
      //   }
      // }}
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
  if (!estimated) return `${from}–${to} của ${count !== -1 ? count : `đến ${to}`}`
  return `${from}–${to} của ${count !== -1 ? count : `đến ${estimated > to ? estimated : to}`}`
}

export const StickyDataGrid = styled(DataGridPro)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    position: 'sticky',
    top: 0,
    // Replace background colour if necessary
    backgroundColor: theme.palette.background.paper,
    // Display header above grid data, but below any popups
    zIndex: 1
  },
  '& .MuiDataGrid-toolbarContainer': {
    position: 'sticky',
    top: '0',
    backgroundColor: '#fff',
    zIndex: 1
  }
}))
