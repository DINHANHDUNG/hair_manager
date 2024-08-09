import WarningIcon from '@mui/icons-material/Warning'
import { Chip, Grid } from '@mui/material'
import { GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid'
import { useState } from 'react'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'
import SubCard from '../../../../components/ui-component/cards/SubCard'
import { gridSpacingForm } from '../../../../constants'

interface alertsType {
  time: string
  date: string
  alertLevel: string
  icon?: React.ReactElement
}

const alerts = [
  {
    time: 'Thứ 7',
    date: '20/05/2024',
    alertLevel: 'High',
    icon: <WarningIcon color='error' />
  },
  {
    time: 'Thứ 6',
    date: '20/05/2024',
    alertLevel: 'Medium',
    icon: <WarningIcon color='warning' />
  },
  {
    time: 'Thứ 6',
    date: '20/05/2024',
    alertLevel: 'Low',
    icon: <WarningIcon color='inherit' />
  }
] as alertsType[]

// const renderContentLeft = (item: alertsType) => {
//   return (
//     <>
//       <Typography variant='h6' color='GrayText'>
//         {item.time}
//       </Typography>
//       <Typography variant='caption' color='GrayText'>
//         {item.date}
//       </Typography>
//     </>
//   )
// }

// const renderContentRight = (item: alertsType) => {
//   return (
//     <>
//       <Typography variant='h6' color='black' sx={{ mt: 1 }}>
//         {item.alertLevel}
//       </Typography>
//     </>
//   )
// }

const rows: GridRowsProp = alerts.map((alert, index) => ({
  id: index,
  order: index + 1,
  date: alert.date,
  alertLevel: alert.alertLevel,
  alertContent: 'Nội dung cảnh báo ' + (index + 1) // Replace with actual content
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
  { field: 'alertContent', headerName: 'Nội dung cảnh báo', flex: 3, minWidth: 200 },
  {
    field: 'alertLevel',
    headerName: 'Mức độ cảnh báo',
    flex: 1,
    minWidth: 180,
    renderCell: (params: GridRenderCellParams) => {
      const color = params.value === 'High' ? 'error' : params.value === 'Medium' ? 'warning' : 'default'
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

export default function TabAlertLevels() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  return (
    <Grid container spacing={gridSpacingForm}>
      {/* <Grid item xs={12} sm={12} md={12} lg={6} sx={{ mb: 3 }}>
        <SubCard title='Mức độ cảnh báo'>
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.2
              }
            }}
          >
            {alerts.map((alert, index) => (
              <CustomTimelineItem
                key={index}
                leftContent={renderContentLeft(alert)}
                rightContent={renderContentRight(alert)}
                icon={alert.icon}
              />
            ))}
          </Timeline>
        </SubCard>
      </Grid> */}
      <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 3 }}>
        <SubCard title='Danh sách cảnh báo'>
          <TableDataGrid
            rows={rows}
            columns={columns}
            isLoading={false}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            // onRowSelectionChange={onRowSelectionChange}
            // onRowClick={onRowClick}
            // checkboxSelection
            // otherProps={{
            //   getRowHeight: () => 'auto'
            // }}
            filterMode='server'
            headerFilters={false}
          />
        </SubCard>
      </Grid>
    </Grid>
  )
}
