import { GridCallbackDetails, GridColDef, GridRowSelectionModel, GridRowsProp } from '@mui/x-data-grid'
import { GridRenderHeaderFilterProps } from '@mui/x-data-grid-pro'
import * as React from 'react'
import { CustomSelectFilterDataGrid } from '../../components/table-data-grid/CustomFilterDataGrid'
import CustomInputFilterDataGrid from '../../components/table-data-grid/CustomInputFilterDataGrid'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import MainCard from '../../components/ui-component/cards/MainCard'

// const { useQuery, ...data } = createFakeServer()

const AdminPage = () => {
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 1
  })

  // const { isLoading, rows } = useQuery(queryOptions)

  const rows: GridRowsProp = [
    { id: 1, username: 'Alice', age: 25 },
    { id: 2, username: 'Bob', age: 30 },
    { id: 3, username: 'Charlie', age: 35 }
    // Thêm các hàng dữ liệu khác nếu cần
  ]

  // State để lưu trữ các giá trị filter hiện tại
  const [filters, setFilters] = React.useState<{ [field: string]: string }>({})
  console.log('filters', filters)

  // Hàm để cập nhật giá trị filter
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }))
  }

  const onRowSelectionChange = (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => {
    console.log(rowSelectionModel, details)
  }

  const data = {
    columns: [
      // { field: 'id', headerName: 'ID' },
      { field: 'username', headerName: 'User Name' },
      { field: 'address', headerName: 'Địa chỉ' },
      { field: 'age', headerName: 'Tuổi' }
      // Thêm các cột khác nếu cần
    ]
  }

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
      case 'username':
        return {
          ...colDef,
          minWidth: 200,
          renderHeaderFilter: (params: GridRenderHeaderFilterProps) => (
            <CustomSelectFilterDataGrid
              {...params}
              filterValue={filters[colDef.field] || ''}
              onFilterChange={handleFilterChange}
              data={[{ value: 'true', label: 'true' }]}
            />
          )
        }

      case 'address':
        return {
          ...colDef,
          minWidth: 200,
          renderHeaderFilter: (params: GridRenderHeaderFilterProps) => (
            <CustomInputFilterDataGrid
              {...params}
              filterValue={filters[colDef.field] || ''}
              onFilterChange={handleFilterChange}
            />
          )
        }
      case 'age':
        return {
          ...colDef,
          minWidth: 200,
          renderHeaderFilter: (params: GridRenderHeaderFilterProps) => (
            <CustomInputFilterDataGrid
              {...params}
              filterValue={filters[colDef.field] || ''}
              onFilterChange={handleFilterChange}
              type='number'
            />
          )
        }

      default:
        return colDef
    }
  }

  const columns: GridColDef[] = React.useMemo(
    () => data.columns.map((colDef) => renderColumn(colDef)),
    [data.columns, filters]
  )

  return (
    <MainCard title='Danh sách đơn hàng'>
      <div style={{ maxHeight: '70vh', width: '100%' }}>
        <TableDataGrid
          rows={rows}
          columns={columns}
          isLoading={false}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          onRowSelectionChange={onRowSelectionChange}
          checkboxSelection
          filterMode='server'
          headerFilters={true}
        />
      </div>
    </MainCard>
  )
}

export default AdminPage
