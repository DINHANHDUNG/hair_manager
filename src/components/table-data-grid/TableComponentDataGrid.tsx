import { alpha, styled } from '@mui/system'
import {
  DataGridPro,
  GridAutosizeOptions,
  GridCallbackDetails,
  gridClasses,
  GridColDef,
  GridFilterModel,
  GridFooterContainer,
  gridPageCountSelector,
  gridPageSelector,
  GridPagination,
  GridPaginationModel,
  GridRowId,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp,
  MuiEvent,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid-pro'
import React, { ReactElement } from 'react'
import CustomToolbar from './CustomToolbarDataGrid'
import { Pagination } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const ODD_OPACITY = 0.2

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
  rowSelectionModel?: GridRowId[]
  onRowClick?: (
    params: GridRowParams, // GridRowParams
    event: MuiEvent<React.MouseEvent<HTMLElement>>, // MuiEvent<React.MouseEvent<HTMLElement>>
    details: GridCallbackDetails // GridCallbackDetails
  ) => void
  totalCount?: number
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
  totalCount,
  rowSelectionModel,
  otherProps // Các props bổ sung
}) => {
  const theme = useTheme()
  return (
    <DataGridPro
      //   {...data}
      autoHeight
      checkboxSelection={checkboxSelection}
      headerFilters={headerFilters}
      onRowSelectionModelChange={onRowSelectionChange}
      rowSelectionModel={rowSelectionModel || []}
      keepNonExistentRowsSelected
      onRowClick={onRowClick}
      columns={columns}
      disableColumnFilter
      rows={rows}
      // rowModesModel={'server'}
      // rowsLoadingMode='server'
      // columnVisibilityModel={'server'}
      // columnOrderModel={'server'}
      // editMode='row'
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
      rowCount={totalCount || 0}
      localeText={{
        MuiTablePagination: {
          labelDisplayedRows,
          labelRowsPerPage: 'Số bản ghi'
        },

        footerRowSelected: (count) => (checkboxSelection ? `Đã chọn ${count}` : '')
      }}
      disableColumnReorder={true} //Tắt di chuyển cột
      disableRowSelectionOnClick
      sx={{
        '.MuiDataGrid-columnSeparator': {
          display: 'none'
        },
        '&.MuiDataGrid-root': {
          border: 'none'
        },
        '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
          outline: 'none !important'
        },
        [`& .${gridClasses.cell}`]: {
          py: 1,
          display: 'flex',
          alignItems: 'center' // Center text vertically
        },
        [`& .${gridClasses.row}.even`]: {
          backgroundColor: theme.palette.grey[200],
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
              backgroundColor: 'transparent'
            }
          }
        }
      }}
      slots={{
        // headerFilterMenu: null,
        footer: CustomFooter,
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

export function CustomPagination() {
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const pageCount = useGridSelector(apiRef, gridPageCountSelector)

  return (
    <Pagination
      color='primary'
      count={pageCount}
      page={page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  )
}

function CustomFooter() {
  return (
    <GridFooterContainer>
      <CustomPagination />
      <GridPagination />
    </GridFooterContainer>
  )
}
