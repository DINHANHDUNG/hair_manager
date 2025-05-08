import { yupResolver } from '@hookform/resolvers/yup'
import { Grid, IconButton, Tooltip, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { VALIDATE } from '../../../../common/validate'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyDatePicker from '../../../../components/dateTime/MyDatePicker'
import MyTextField from '../../../../components/input/MyTextField'
import SubCard from '../../../../components/ui-component/cards/SubCard'
import { gridSpacingForm, PERMISSION } from '../../../../constants'
//Icon
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid'
import { useDialogs } from '@toolpad/core'
import dayjs from 'dayjs'
import moment from 'moment'
import { currency, handleMutation, useAppSelector } from '../../../../app/hooks'
import {
  useAddSalaryStaffMutation,
  useDeleteSalaryStaffMutation,
  useGetListSalaryStaffQuery,
  useUpdateSalaryStaffMutation
} from '../../../../app/services/staff'
import { NumericFormatCustom } from '../../../../components/input'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'
import { SalaryStaffType, StaffType } from '../../../../types/staff'
import { authStore } from '../../../../app/selectedStore'

type Field = 'basicMoney' | 'officialMoney' | 'probationMoney' | 'date'

type FormValues = {
  basicMoney?: number
  officialMoney?: number
  probationMoney?: number
  date: string
}

const validationSchema = yup
  .object({
    basicMoney: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .typeError('Trường này phải là số'),
    officialMoney: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .typeError('Trường này phải là số'),
    probationMoney: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .typeError('Trường này phải là số'),
    date: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng')
  })
  .test(
    'one-and-only-one',
    'Bạn phải nhập đúng một trong ba trường: Lương cơ bản, Lương chính thức, Lương thử việc',
    function (values) {
      const { basicMoney, officialMoney, probationMoney } = values

      const fields = [
        { name: 'basicMoney', value: basicMoney },
        { name: 'officialMoney', value: officialMoney },
        { name: 'probationMoney', value: probationMoney }
      ]

      const filledFields = fields.filter((field) => field.value !== undefined)

      if (filledFields.length === 0) {
        return this.createError({
          path: '',
          message: 'Bạn phải nhập ít nhất một trong ba trường: Lương cơ bản, Lương chính thức, Lương thử việc'
        })
      }

      if (filledFields.length > 1) {
        return this.createError({
          path: filledFields[0].name, // Gán lỗi cho trường đầu tiên có giá trị
          message: 'Chỉ được phép nhập một trong ba trường: Lương cơ bản, Lương chính thức, Lương thử việc'
        })
      }

      return true
    }
  )

const renderColumn = (colDef: { field: string; headerName: string }) => {
  switch (colDef.field) {
    default:
      return colDef
  }
}

interface Props {
  dataStaff: StaffType
  reloadData?: () => void
}

export default function TabSalary(Props: Props) {
  const { dataStaff } = Props
  const dialogs = useDialogs()
  const role = useAppSelector(authStore)?.user?.role
  const checkPremisionAdd = [PERMISSION.ADMIN, PERMISSION.KETOAN]?.some((e) => role === e)
  const myFormRef = useRef<Element | null>(null)
  const [idUpdate, setIdUpdate] = useState<number>()
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [rowsData, setRowsData] = useState<SalaryStaffType[]>()

  const {
    data: dataApi,
    isLoading,
    refetch
  } = useGetListSalaryStaffQuery({
    staffId: dataStaff.id
  })
  const [deleteSalaryStaff, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteSalaryStaffMutation()
  const [addSalaryStaff, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddSalaryStaffMutation()
  const [
    updateSalaryStaff,
    { isLoading: loadingUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate, error: errorUpdate }
  ] = useUpdateSalaryStaffMutation()

  const rows: GridRowsProp = rowsData || []
  const rowTotal = dataApi?.data?.length || 0

  const data = [
    {
      field: 'order',
      headerName: 'No.',
      // flex: 1,
      width: 50
    },
    {
      field: 'probationMoney',
      headerName: 'Thử việc',
      flex: 1,
      renderCell: (params: GridRenderCellParams<SalaryStaffType, number>) =>
        params.row.probationMoney ? currency(params.row.probationMoney) : ''
    },
    {
      field: 'basicMoney',
      headerName: 'Cơ bản',
      flex: 1,
      renderCell: (params: GridRenderCellParams<SalaryStaffType, number>) =>
        params.row.basicMoney ? currency(params.row.basicMoney) : ''
    },
    {
      field: 'officialMoney',
      headerName: 'Chính thức',
      flex: 1,
      renderCell: (params: GridRenderCellParams<SalaryStaffType, number>) =>
        params.row.officialMoney ? currency(params.row.officialMoney) : ''
    },
    {
      field: 'date',
      headerName: 'Hiệu lực',
      flex: 1,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<SalaryStaffType, number>) =>
        params.row.date ? moment(params.row.date).format('DD/MM/YYYY') : ''
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      type: 'actions',
      flex: 1,
      minWidth: 150,
      getActions: (param: GridRenderCellParams<SalaryStaffType, number>) => {
        return checkPremisionAdd
          ? [
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
          : []
      }
    }
  ]

  const columns: GridColDef[] = useMemo(() => data.map((colDef) => renderColumn(colDef)), [data, dataApi])

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

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const date = moment(data.date).startOf('day')
    const isoDateStr = date?.toISOString()
    const newData = {
      ...data,
      basicMoney: data?.basicMoney ?? null,
      officialMoney: data?.officialMoney ?? null,
      probationMoney: data?.probationMoney ?? null,
      staffId: dataStaff.id,
      date: isoDateStr
    }
    if (idUpdate) {
      updateSalaryStaff({ ...newData, id: idUpdate })
    } else {
      addSalaryStaff({ ...newData })
    }
    setIdUpdate(0)
    // handleSave(data)
  }

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      deleteSalaryStaff({ ids: [Number(id)] })
    }
  }

  const editItem = (item: SalaryStaffType) => {
    setIdUpdate(item.id)
    setValue('date', dayjs(item.date).toString())
    setValue('basicMoney', item.basicMoney || undefined)
    setValue('officialMoney', item.officialMoney || undefined)
    setValue('probationMoney', item.probationMoney || undefined)
    clearErrors()
    scrollFormAddEdit()
  }

  const addItem = () => {
    setIdUpdate(0)
    reset()
    clearErrors()
    scrollFormAddEdit()
  }

  const handleFormMutation = (
    loading: boolean,
    isError: boolean,
    isSuccess: boolean,
    error: unknown,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!loading && isError) {
      const newError = error as {
        data: {
          errors: string
          keyError: Field
          message: string
          status: string
        }
      }
      newError &&
        setError(newError?.data?.keyError, { type: 'manual', message: newError?.data?.message } as ErrorOption)
    }
    handleMutation({
      successMessage,
      errorMessage,
      isError,
      isSuccess,
      loading,
      refetch: () => {
        refetch()
        reset()
      }
    })
  }

  const scrollFormAddEdit = () => {
    if (myFormRef.current) {
      myFormRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    handleMutation({
      successMessage: 'Thao tác thành công',
      errorMessage: 'Thao tác không thành công',
      isError,
      isSuccess,
      loading: loadingDelete,
      refetch
    })
  }, [loadingDelete])

  useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      dataApi?.data?.map((row: SalaryStaffType, index: number) => ({
        ...row,
        order: paginationModel.page * paginationModel.pageSize + index + 1
      })) || []

    setRowsData(updatedRows)
  }, [dataApi])

  useEffect(() => {
    handleFormMutation(
      loadingAdd,
      isErrorAdd,
      isSuccessAdd,
      error,
      'Thêm mới lương thưởng',
      'Thêm mới không lương thưởng'
    )
  }, [loadingAdd])

  useEffect(() => {
    handleFormMutation(
      loadingUpdate,
      isErrorUpdate,
      isSuccessUpdate,
      errorUpdate,
      'Cập nhật thành công',
      'Cập nhật không thành công'
    )
  }, [loadingUpdate])

  return (
    <Grid container spacing={gridSpacingForm}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 3 }}>
        <SubCard
          title={
            <Grid item xs={12} container alignItems={'center'} justifyContent={'space-between'} flexDirection={'row'}>
              <Typography variant='h5'>Danh sách lương</Typography>
              <div>
                {checkPremisionAdd && (
                  <IconButton color='inherit' size='small' onClick={() => addItem()}>
                    <Tooltip title='Thêm mới'>
                      <AddCircleOutlineIcon fontSize='inherit' />
                    </Tooltip>
                  </IconButton>
                )}
              </div>
            </Grid>
          }
        >
          <TableDataGrid
            rows={rows}
            columns={columns}
            isLoading={isLoading}
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
      {checkPremisionAdd && (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mb: 3 }}>
          <SubCard title={`${idUpdate ? 'Cập nhật' : 'Thêm'} lương thưởng`}>
            <form ref={(ref) => (myFormRef.current = ref)} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={gridSpacingForm}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <MyTextField
                    name='probationMoney'
                    control={control}
                    label='Lương thử việc'
                    errors={errors}
                    variant='outlined'
                    textFieldProps={{ placeholder: 'Nhập dữ liệu ở đây' }} // Truyền các props tùy chọn cho TextField
                    InputProps={{
                      /* eslint-disable @typescript-eslint/no-explicit-any */
                      inputComponent: NumericFormatCustom as any
                      /* eslint-enable @typescript-eslint/no-explicit-any */
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <MyTextField
                    name='officialMoney'
                    control={control}
                    label='Lương chính thức'
                    errors={errors}
                    variant='outlined'
                    textFieldProps={{ placeholder: 'Nhập dữ liệu ở đây' }} // Truyền các props tùy chọn cho TextField
                    InputProps={{
                      /* eslint-disable @typescript-eslint/no-explicit-any */
                      inputComponent: NumericFormatCustom as any
                      /* eslint-enable @typescript-eslint/no-explicit-any */
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <MyTextField
                    name='basicMoney'
                    control={control}
                    label='Lương cơ bản'
                    errors={errors}
                    variant='outlined'
                    textFieldProps={{ placeholder: 'Nhập dữ liệu ở đây' }} // Truyền các props tùy chọn cho TextField
                    InputProps={{
                      /* eslint-disable @typescript-eslint/no-explicit-any */
                      inputComponent: NumericFormatCustom as any
                      /* eslint-enable @typescript-eslint/no-explicit-any */
                    }}
                  />
                </Grid>
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
      )}
    </Grid>
  )
}
