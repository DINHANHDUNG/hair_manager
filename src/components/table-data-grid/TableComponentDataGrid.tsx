import { Pagination } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { alpha } from '@mui/system'
import {
  DataGridPro,
  GridApiPro,
  GridAutosizeOptions,
  GridCallbackDetails,
  GridCellParams,
  gridClasses,
  GridColDef,
  GridColumnOrderChangeParams,
  GridColumnsInitialState,
  GridColumnVisibilityModel,
  GridDetailPanelToggleCell,
  GridFilterModel,
  GridFooterContainer,
  gridPageCountSelector,
  gridPageSelector,
  GridPagination,
  GridPaginationModel,
  GridPinnedColumnFields,
  GridRowId,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp,
  GridTreeNode,
  MuiEvent,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid-pro'
import { arrayMoveImmutable } from 'array-move'
import React, { ReactElement, useEffect } from 'react'
import { isEmpty } from '../../app/hooks'
import { localStorageHelper } from '../../help/localHelp'
import CustomToolbar from './CustomToolbarDataGrid'

const ODD_OPACITY = 0.2
/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomToggleCell = (props: any) => {
  if (!props.row) return null
  if (!props.showDetailPanelToggle || props.showDetailPanelToggle(props.row)) {
    return <GridDetailPanelToggleCell {...props} />
  }
  return null
}
/* eslint-enable @typescript-eslint/no-explicit-any */

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
  onRowDoubleClick?: (
    params: GridRowParams, // GridRowParams
    event: MuiEvent<React.MouseEvent<HTMLElement>>, // MuiEvent<React.MouseEvent<HTMLElement>>
    details: GridCallbackDetails // GridCallbackDetails
  ) => void
  onCellDoubleClick?: (params: GridCellParams, event: React.MouseEvent<HTMLElement>) => void
  onCellClick?: (params: GridCellParams, event: React.MouseEvent<HTMLElement>) => void
  totalCount?: number
  rowHeight?: number
  pinnedColumns?: GridPinnedColumnFields | undefined
  tableKey?: string
  hideFooter?: boolean
  pagination?: boolean
  apiRef?: React.MutableRefObject<GridApiPro> | undefined
  /* eslint-disable @typescript-eslint/no-explicit-any */
  processRowUpdate?: (newRow: any, oldRow: any, params: any) => any | Promise<any>
  onProcessRowUpdateError?: (error: any) => void
  getDetailPanelContent?: (row: any) => React.ReactNode
  getDetailPanelHeight?: (row: any) => number
  getDetailPanelExpandedRowIds?: any
  showDetailPanelToggle?: (row: any) => boolean
  isRowExpandable?: (row: GridRowParams) => boolean
  isCellEditable?: ((params: GridCellParams<any, any, any, GridTreeNode>) => boolean) | undefined
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

const autosizeOptions: GridAutosizeOptions = {
  includeOutliers: true
}

const TableDataGrid: React.FC<TableDataGridProps> = ({
  //   data,
  columns: initialColumns,
  rows,
  isLoading,
  paginationModel,
  setPaginationModel,
  onRowSelectionChange,
  onRowClick,
  onRowDoubleClick,
  onCellDoubleClick,
  onCellClick,
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
  rowHeight,
  pinnedColumns,
  hideFooter,
  pagination,
  otherProps, // Các props bổ sung
  tableKey, // Thêm prop key động
  processRowUpdate,
  onProcessRowUpdateError,
  apiRef,
  getDetailPanelHeight,
  getDetailPanelContent,
  isCellEditable
}) => {
  const theme = useTheme()

  // Tạo key riêng cho từng bảng
  const COLUMN_KEY = `datagrid_columns_config_${tableKey}`

  // Lấy cấu hình cột từ localStorage hoặc dùng cột mặc định
  const getSavedColumns = (): GridColDef[] => {
    const savedColumns = tableKey ? localStorageHelper.getItem<GridColDef[]>(COLUMN_KEY, []) : []

    if (savedColumns?.length > 0) {
      // Map theo thứ tự `savedColumns`
      const newCol = savedColumns.map((savedCol) => ({
        ...initialColumns.find((col) => col.field === savedCol.field), // Kế thừa giá trị mặc định
        ...savedCol // Ghi đè giá trị từ savedColumns
      }))

      // Thêm các cột mới từ initialColumns không có trong savedColumns
      const missingColumns = initialColumns.filter(
        (col) => !savedColumns.some((savedCol) => savedCol.field === col.field)
      )

      // Ghép các cột lại (cột mới được thêm vào cuối)
      const finalColumns = [...newCol, ...missingColumns]
      return finalColumns
    }

    // Nếu không có dữ liệu trong `localStorage`, trả về `initialColumns`
    return initialColumns
  }

  const [columns, setColumns] = React.useState<GridColDef[]>([])

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState<GridColumnVisibilityModel>(() => {
    const visibilityModel: GridColumnVisibilityModel = {}

    initialColumns.forEach((col) => {
      // Mặc định tất cả cột đều hiển thị nếu không có thông tin trong `localStorage`
      visibilityModel[col.field] = true
    })

    return { ...visibilityModel }
  })

  const checkColumnsVisiblityModel = () => {
    const visibilityModel: GridColumnVisibilityModel = {}
    initialColumns.forEach((col) => {
      visibilityModel[col.field] = true
    })
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const savedVisibilityModel = localStorageHelper.getItem(COLUMN_KEY, []) as any
    const visibilityModelLocal: GridColumnVisibilityModel = {}

    savedVisibilityModel.forEach((col: any) => {
      visibilityModelLocal[col.field] = !col.hide
    })
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const newModel = { ...visibilityModel, ...visibilityModelLocal }

    setColumnVisibilityModel((prev) => (JSON.stringify(prev) === JSON.stringify(newModel) ? prev : newModel))
  }

  const handleColumnVisibilityChange = (newModel: GridColumnVisibilityModel) => {
    const checkModel = isEmpty(newModel)

    const updatedColumns = columns?.map((col) => ({
      ...col,
      hide: checkModel ? false : !newModel[col.field]
    }))

    setColumns([...updatedColumns])
    setColumnVisibilityModel(newModel)
    localStorageHelper.setItem(COLUMN_KEY, updatedColumns)
  }

  const handleColumnOrderChange = (newColumns: GridColumnOrderChangeParams) => {
    const { oldIndex, targetIndex } = newColumns

    // Kiểm tra tính hợp lệ của indices
    // if (
    //   oldIndex < 0 ||
    //   targetIndex < 0 ||
    //   oldIndex === targetIndex ||
    //   oldIndex >= columns.length ||
    //   targetIndex >= columns.length
    // ) {
    //   console.error('Invalid indices for column reorder', { oldIndex, targetIndex })
    //   return
    // }
    const newOrder = [...columns]
    const moveColumn = arrayMoveImmutable(newOrder, oldIndex - 1, targetIndex - 1)
    console.log('updatedColumns', moveColumn)

    // Cập nhật state và lưu localStorage
    setColumns(moveColumn)
    localStorageHelper.setItem(COLUMN_KEY, moveColumn)
  }

  useEffect(() => {
    const updatedColumns = getSavedColumns()
    setColumns(updatedColumns)
  }, [initialColumns])

  useEffect(() => {
    checkColumnsVisiblityModel()
  }, [])

  return (
    <DataGridPro
      //   {...data}
      apiRef={apiRef} // Thêm dòng này
      initialState={{ pinnedColumns: pinnedColumns || {}, columns: initialColumns as GridColumnsInitialState }}
      autoHeight
      checkboxSelection={checkboxSelection}
      headerFilters={headerFilters}
      onRowSelectionModelChange={onRowSelectionChange}
      rowSelectionModel={rowSelectionModel || []}
      keepNonExistentRowsSelected
      onRowClick={onRowClick}
      onRowDoubleClick={onRowDoubleClick}
      onCellDoubleClick={onCellDoubleClick}
      onCellClick={(params, event) => {
        // Không cho mở edit nếu:
        if (!params.isEditable || params.field === '__check__') return onCellClick?.(params, event)

        // Tránh trigger khi click vào nút, icon, v.v
        const target = event.target as HTMLElement
        const isButton = target.closest('button, svg, path, a, input')
        if (isButton) return

        const currentCell = apiRef?.current?.getCellMode(params.id, params.field)
        if (currentCell === 'edit') return
        // Force mở edit mode
        apiRef?.current?.startCellEditMode({
          id: params.id,
          field: params.field
        })
        // onCellClick?.(params, event)
      }}
      columns={columns}
      disableColumnFilter
      rows={rows}
      // rowModesModel={'server'}
      // rowsLoadingMode='server'
      // columnVisibilityModel={'server'}
      // columnOrderModel={'server'}
      editMode={'cell'}
      filterMode={filterMode || 'server'}
      onFilterModelChange={onFilterChange}
      loading={isLoading}
      pageSizeOptions={pageSizeOptions || [10, 20, 50]}
      paginationModel={paginationModel}
      paginationMode='server'
      pagination={pagination}
      getRowHeight={() => (rowHeight ? rowHeight : 'auto')}
      onPaginationModelChange={setPaginationModel}
      autosizeOptions={autosizeOptions}
      rowCount={totalCount || 0}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={handleColumnVisibilityChange}
      onColumnOrderChange={(params) => handleColumnOrderChange(params)}
      localeText={{
        MuiTablePagination: {
          labelDisplayedRows,
          labelRowsPerPage: 'Số bản ghi'
        },
        noResultsOverlayLabel: 'Không có bản ghi nào',
        noRowsLabel: 'Không có bản ghi nào',
        footerRowSelected: (count) => (checkboxSelection ? `Đã chọn ${count}` : '')
      }}
      // isRowExpandable={isRowExpandable}
      // disableColumnMenu
      disableColumnReorder={false} //Tắt di chuyển cột
      disableRowSelectionOnClick
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={onProcessRowUpdateError}
      getDetailPanelContent={getDetailPanelContent ? (params) => <>{getDetailPanelContent(params.row)}</> : undefined}
      getDetailPanelHeight={getDetailPanelHeight ? (params) => getDetailPanelHeight(params.row) : undefined}
      getRowClassName={(params) => (params.row.invoiceRepairs?.length > 0 ? '' : 'no-expand')}
      isCellEditable={isCellEditable}
      // experimentalFeatures={{ newEditingApi: true }}
      sx={{
        // '.MuiDataGrid-columnSeparator': {
        //   display: 'none'
        // },
        '& .no-expand .MuiDataGrid-detailPanelToggleCell': {
          display: 'none'
        },
        // '& .MuiDataGrid-detailPanelToggleCell[data-hasdetail="false"]': {
        //   display: 'none' // Ẩn dấu +
        // },
        '&.MuiDataGrid-root': {
          border: 'none'
        },
        // '&.MuiDataGrid-root .MuiDataGrid-renderingZone': {
        //   maxHeight: 'none !important'
        // },
        '&.MuiDataGrid-root .MuiDataGrid-cell': {
          // lineHeight: 'unset !important',
          // maxHeight: 'none !important',
          // whiteSpace: 'normal'
          color: '#222222'
        },
        '&.MuiDataGrid-root .MuiDataGrid-row': {
          // maxHeight: 'none !important',
          backgroundColor: 'white'
        },
        '&.MuiDataGrid-root .MuiInputBase-input': {
          borderRadius: '6px',
          backgroundColor: 'white'
        },
        '&.MuiDataGrid-root .MuiDataGrid-columnHeaderTitle': {
          color: '#7A7A7A !important',
          fontWeight: '400'
        },
        '&.MuiDataGrid-root .MuiDataGrid-columnHeader': {
          height: '40px !important'
        },
        '&.MuiDataGrid-root .MuiDataGrid-columnHeader--filledGroup': {
          height: '30px !important'
        },
        '&.MuiDataGrid-root .MuiDataGrid-columnHeader--filledGroup .MuiDataGrid-columnHeaderTitleContainer': {
          borderBottomWidth: '0px !important',
          height: '30px !important'
        },
        '&.MuiDataGrid-root .MuiDataGrid-columnHeader--emptyGroup': {
          height: '30px !important'
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
      /* eslint-disable @typescript-eslint/no-explicit-any */
      slots={
        {
          // headerFilterMenu: null,
          detailPanelToggleCell: CustomToggleCell,
          footer: hideFooter ? undefined : CustomFooter,
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
        } as any
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
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
