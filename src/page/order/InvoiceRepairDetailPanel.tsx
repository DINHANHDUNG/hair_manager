import React from 'react'
import { Box, Chip, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro'
import { InvoiceRepairType } from '../../types/invoiceRepair'
import TableDataGrid from '../../components/table-data-grid/TableComponentDataGrid'
import { checkBg, checkColor, OPTIONS_STATUS_ORDER } from '../../common/contants'

interface InvoiceRepairDetailPanelProps {
  data: InvoiceRepairType[]
}

const columns: GridColDef[] = [
  {
    field: 'code',
    headerName: 'Mã đơn sửa',
    width: 200
  },
  {
    field: 'reasonRepair',
    headerName: 'Đơn sửa',
    width: 200
  },
  {
    field: 'dateReceive',
    headerName: 'Ngày xưởng nhận',
    width: 180,
    renderCell: (params) => (params.value ? dayjs(params.value).format('DD/MM/YYYY') : '')
  },
  {
    field: 'statusOrder',
    headerName: 'Trạng thái bán hàng',
    width: 150,
    renderCell: (params: GridRenderCellParams) => {
      const status = OPTIONS_STATUS_ORDER.find((e) => e.value === params.value?.toString())
      if (!status) return null

      return (
        <Chip
          label={status.label}
          sx={{
            backgroundColor: checkBg(status.value),
            color: checkColor(status.value),
            fontWeight: 500
          }}
          size='small'
          variant='outlined'
        />
      )
    }
  },
  {
    field: 'statusManufacture',
    headerName: 'Trạng thái sản xuất',
    width: 150,
    renderCell: (params: GridRenderCellParams) => {
      const status = OPTIONS_STATUS_ORDER.find((e) => e.value === params.value?.toString())
      if (!status) return null

      return (
        <Chip
          label={status.label}
          sx={{
            backgroundColor: checkBg(status.value),
            color: checkColor(status.value),
            fontWeight: 500
          }}
          size='small'
          variant='outlined'
        />
      )
    }
  },
  {
    field: 'dateDelivery',
    headerName: 'Ngày xưởng giao lại',
    width: 180,
    renderCell: (params) => (params.value ? dayjs(params.value).format('DD/MM/YYYY') : '')
  },
  {
    field: 'noteRepair',
    headerName: 'Ghi chú',
    width: 250
  }
]

const InvoiceRepairDetailPanel: React.FC<InvoiceRepairDetailPanelProps> = ({ data }) => {
  return (
    <Box
      sx={{
        my: 2,
        // ml: '100px', // 👈 Đẩy bảng detail tránh đè lên pinned column
        p: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: '#fdfdfd',
        boxShadow: '0px 1px 5px rgba(0,0,0,0.08)'
      }}
    >
      <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
        ➤ Danh sách đơn sửa
      </Typography>
      {data?.length > 0 ? (
        <TableDataGrid
          tableKey='repair_detail'
          columns={columns}
          rows={data}
          isLoading={false}
          pagination={false}
          paginationModel={{ page: 0, pageSize: data.length }}
          setPaginationModel={() => console.log('')}
          hideFooter
          checkboxSelection={false}
          headerFilters={false}
          filterMode='client'
        />
      ) : (
        <Typography variant='body2'>Không có đơn sửa</Typography>
      )}
    </Box>
  )
}

export default InvoiceRepairDetailPanel
