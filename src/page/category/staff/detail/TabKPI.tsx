import { Chip, Grid } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid'
import { useState } from 'react'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'
import SubCard from '../../../../components/ui-component/cards/SubCard'
import { gridSpacingForm } from '../../../../constants'

interface kpiType {
  date: string
  kpiName: string
  kpiValue: string
  status: string
}

const kpis = [
  {
    date: '01/01/2024',
    kpiName: 'KPI 1',
    kpiValue: '80%',
    status: 'Completed'
  },
  {
    date: '01/02/2024',
    kpiName: 'KPI 2',
    kpiValue: '60%',
    status: 'In Progress'
  },
  {
    date: '01/03/2024',
    kpiName: 'KPI 3',
    kpiValue: '90%',
    status: 'Completed'
  }
] as kpiType[]

const rows: GridRowsProp = kpis.map((kpi, index) => ({
  id: index,
  order: index + 1,
  date: kpi.date,
  kpiName: kpi.kpiName,
  kpiValue: kpi.kpiValue,
  status: kpi.status
}))

const columns: GridColDef[] = [
  {
    field: 'order',
    headerName: 'No.',
    width: 50,
    renderCell: (params: GridRenderCellParams) => {
      const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id)
      const { page, pageSize } = params.api.state.pagination.paginationModel
      return page * pageSize + (rowIndex + 1)
    }
  },
  { field: 'date', headerName: 'Ngày', flex: 1, minWidth: 120 },
  { field: 'kpiName', headerName: 'Tên KPI', flex: 2, minWidth: 120 },
  { field: 'kpiValue', headerName: 'Giá trị KPI', flex: 1, minWidth: 150 },
  {
    field: 'status',
    headerName: 'Trạng thái',
    flex: 1,
    minWidth: 150,
    renderCell: (params: GridRenderCellParams) => {
      const color = params.value === 'Completed' ? 'success' : params.value === 'In Progress' ? 'warning' : 'default'
      return (
        <Chip
          size='small'
          label={params.value}
          color={color}
          sx={{
            bgcolor: color
          }}
        />
      )
    }
  }
]

export default function TabKPI() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  return (
    <Grid container spacing={gridSpacingForm}>
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 3 }}>
        <SubCard title='Danh sách KPI'>
          <TableDataGrid
            rows={rows}
            columns={columns}
            isLoading={false}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            // onRowSelectionChange={onRowSelectionChange}
            // onRowClick={onRowClick}
            // checkboxSelection
            filterMode='server'
            headerFilters={false}
          />
        </SubCard>
      </Grid>
    </Grid>
  )
}
