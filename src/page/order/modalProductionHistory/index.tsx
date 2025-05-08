import { yupResolver } from '@hookform/resolvers/yup'
import { Grid, IconButton, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { VALIDATE } from '../../../common/validate'
import SubmitButton from '../../../components/button/SubmitButton'
import MyDatePicker from '../../../components/dateTime/MyDatePicker'
import { CustomDialog } from '../../../components/dialog/CustomDialog'
import MyTextField from '../../../components/input/MyTextField'
import SubCard from '../../../components/ui-component/cards/SubCard'
import { gridSpacingForm } from '../../../constants'
//Icon
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid'
import { useDialogs } from '@toolpad/core'
import dayjs from 'dayjs'
import TableDataGrid from '../../../components/table-data-grid/TableComponentDataGrid'

interface Props {
  open: boolean
  handleClose: () => void
}

type FormValues = {
  date: string
  note: string
}


const validationSchema = yup.object({
  note: yup.string().required('Trường này là bắt buộc').max(255, 'Độ dài không được quá 255'),

  date: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng')
})

export default function ModalProductionHistory(Props: Props) {
  const { open, handleClose } = Props
  const dialogs = useDialogs()
  const [idUpdate, setIdUpdate] = useState<number>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [rowsData, setRowsData] = useState<any[]>()
  const rows: GridRowsProp = rowsData || []
  const rowTotal = 0

  const fakeData = [
    {
      id: 1,
      order: 1,
      date: '2025-04-01',
      note: 'Đang chia hàng'
    },
    {
      id: 2,
      order: 2,
      date: '2025-04-02',
      note: 'Đã gửi lace'
    },
    {
      id: 3,
      order: 3,
      date: '2025-04-03',
      note: 'Đang làm màu'
    }
  ]

  const data = [
    {
      field: 'order',
      headerName: 'No.',
      // flex: 1,
      width: 50
    },
    {
      field: 'date',
      headerName: 'Ngày',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<any, number>) =>
        params.row.date ? moment(params.row.date).format('DD/MM/YYYY') : ''
    },
    { field: 'note', headerName: 'Nội dung', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Hành động',
      type: 'actions',
      flex: 1,
      minWidth: 150,
      getActions: (param: GridRenderCellParams<any, number>) => [
        <GridActionsCellItem
          icon={<EditOutlinedIcon />}
          label='edit'
          className='textPrimary'
          color='inherit'
          onClick={() => editItem(param.row)}
        />,
        <GridActionsCellItem
          onClick={() => handleDelete(param.row.id)}
          icon={<DeleteOutlinedIcon />}
          label='Delete'
          className='textPrimary'
          color='inherit'
        />
      ]
    }
  ]

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
      default:
        return colDef
    }
  }

  const columns: GridColDef[] = useMemo(() => data.map((colDef) => renderColumn(colDef)), [data])

  const addItem = () => {
    setIdUpdate(0)
    reset()
    // clearErrors()
    // scrollFormAddEdit()
  }

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    // if (confirmed) {
    //   deleteHistoryStaff({ ids: [Number(id)] })
    // }
  }

  const editItem = (item: any) => {
    setIdUpdate(item.id)
    setValue('date', dayjs(item.date).toString())
    setValue('note', item.note)
    // setValue('status', item.status)
    // setValue('type', item.type)
    // clearErrors()
    // scrollFormAddEdit()
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const date = moment(data.date).startOf('day')
    const isoDateStr = date?.toISOString()
    // addEmployee({ ...data, birthDay: isoDateStr })s
  }

  useEffect(() => {
    reset()
  }, [open])

  useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      fakeData?.map((row, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [fakeData])

  return (
    <CustomDialog title='Lịch sử sản xuất' open={open} onClose={handleClose} maxWidth='lg' fullWidth>
      <Grid container spacing={gridSpacingForm}>
        <Grid item xs={12} sm={12} md={12} lg={8} xl={8} sx={{ mb: 3 }}>
          <SubCard
            title={
              <Grid item xs={12} container alignItems={'center'} justifyContent={'space-between'} flexDirection={'row'}>
                <Typography variant='h5'>Lịch sử sản xuất</Typography>
                <div>
                  <IconButton color='inherit' size='small' onClick={() => addItem()}>
                    <AddCircleOutlineIcon fontSize='inherit' />
                  </IconButton>
                  {/* <IconButton color='inherit' size='small' onClick={() => setTypeList(!typeList)}>
                    {typeList ? <FormatListNumberedRtlIcon fontSize='inherit' /> : <AppsIcon fontSize='inherit' />}
                  </IconButton> */}
                </div>
              </Grid>
            }
          >
            <TableDataGrid
              rows={rows}
              columns={columns}
              isLoading={false}
              paginationModel={paginationModel}
              setPaginationModel={(model) => {
                setPaginationModel(model)
              }}
              // onRowSelectionChange={onRowSelectionChange}
              // onRowClick={onRowClick}
              // checkboxSelection
              otherProps={{
                getRowHeight: () => 'auto'
              }}
              filterMode='server'
              headerFilters={false}
              totalCount={rowTotal}
            />
          </SubCard>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={4} xl={4} sx={{ mb: 3 }}>
          <SubCard title={`${idUpdate ? 'Cập nhật' : 'Thêm'} lịch sử sản xuất`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={gridSpacingForm}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <MyDatePicker
                    name='date'
                    control={control}
                    label='Ngày'
                    errors={errors}
                    variant='outlined'
                    //   defaultValue={dayjs()}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <MyTextField
                    multiline
                    rows={4}
                    name='note'
                    control={control}
                    label='Mô tả'
                    errors={errors}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mt: 2 }}>
                  <SubmitButton
                    variant='contained'
                    sx={{ float: 'right' }}
                    loading={isSubmitting} // Hiển thị trạng thái tải khi đang submit
                  >
                    {idUpdate ? 'Cập nhật' : 'Thêm'}
                  </SubmitButton>
                </Grid>
              </Grid>
            </form>
          </SubCard>
        </Grid>
      </Grid>
    </CustomDialog>
  )
}
