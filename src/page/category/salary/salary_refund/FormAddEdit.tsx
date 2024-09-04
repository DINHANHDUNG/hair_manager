import { yupResolver } from '@hookform/resolvers/yup'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { Grid, Tooltip } from '@mui/material'
import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid'
import { useDialogs } from '@toolpad/core'
import dayjs from 'dayjs'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { ErrorOption, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { currency } from '../../../../app/hooks'
import { useGetSalaryAdvanceByIdQuery } from '../../../../app/services/salaryAdvance'
import {
  useAddSalaryRefundMutation,
  useDeleteSalaryRefundMutation,
  useGetSalaryRefundByIdQuery,
  useUpdateSalaryRefundMutation
} from '../../../../app/services/salaryRefund'
import { STATUS_ADVANCE_SALARY } from '../../../../common/contants'
import { VALIDATE } from '../../../../common/validate'
import MyButton from '../../../../components/button/MyButton'
import SubmitButton from '../../../../components/button/SubmitButton'
import MyDatePicker from '../../../../components/dateTime/MyDatePicker'
import { CustomDialog } from '../../../../components/dialog/CustomDialog'
import { NumericFormatCustom } from '../../../../components/input'
import MyTextField from '../../../../components/input/MyTextField'
import MySelect from '../../../../components/select/MySelect'
import TableDataGrid from '../../../../components/table-data-grid/TableComponentDataGrid'
import Toast from '../../../../components/toast'
import { gridSpacingForm } from '../../../../constants'
import { SalaryAdvanceType } from '../../../../types/salaryAdvance'
import { SalaryRefundType } from '../../../../types/salaryRefund'
import LoadingModal from '../../../../components/ui-component/LoadingModal'

interface Props {
  open: boolean
  handleClose: () => void
  handleSave: () => void
  itemSelectedEdit?: SalaryRefundType
  itemSelectedSalaryAdvance?: SalaryAdvanceType
}

type Field = 'money' | 'dateRefund' | 'noteRefund' | 'statusRefund'

type FormValues = {
  money: number
  dateRefund: string
  noteRefund?: string
  statusRefund: string
}

const validationSchema = yup.object({
  money: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .typeError('Trường này phải là số')
    .moreThan(0, 'Giá trị phải lớn hơn 0')
    .required('Trường này là bắt buộc'),
  dateRefund: yup
    .string()
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  noteRefund: yup.string().max(255, 'Độ dài không được quá 255'),
  statusRefund: yup.string().max(255, 'Độ dài không được quá 255').required('Trường này là bắt buộc')
})

export default function FormAddEditSalaryRefund({
  open,
  handleClose,
  handleSave,
  itemSelectedEdit,
  itemSelectedSalaryAdvance
}: Props) {
  const dialogs = useDialogs()
  const [deleteSalaryRefund, { isLoading: loadingDelete, isSuccess, isError }] = useDeleteSalaryRefundMutation()
  const [addSalaryRefund, { isLoading: loadingAdd, isSuccess: isSuccessAdd, isError: isErrorAdd, error }] =
    useAddSalaryRefundMutation()
  const {
    data: fetchData,
    isLoading,
    refetch: refetchRefund
  } = useGetSalaryRefundByIdQuery(
    {
      salaryRefundId: itemSelectedEdit?.id || 0
    },
    {
      skip: !itemSelectedEdit?.id
    }
  )

  const {
    data: fetchDataAdvance,
    isLoading: isLoadingAdvance,
    refetch
  } = useGetSalaryAdvanceByIdQuery(
    {
      salaryAdvanceId: itemSelectedSalaryAdvance?.id || 0
    },
    {
      skip: !itemSelectedSalaryAdvance?.id
    }
  )

  const [
    editSalaryRefund,
    { isLoading: loadingEdit, isSuccess: isSuccessEdit, isError: isErrorEdit, error: errorEdit }
  ] = useUpdateSalaryRefundMutation()

  const [rowsData, setRowsData] = useState<SalaryRefundType[]>()
  const rows: GridRowsProp = rowsData || []
  const amountPaid = rowsData?.reduce((e, c) => e + (c.statusRefund === 'ACCEPTED' ? c.money : 0), 0)
  const needPaid = (itemSelectedSalaryAdvance?.money || 0) - (amountPaid || 0)

  const data = {
    columns: [
      {
        field: 'money',
        headerName: 'Số tiền',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryRefundType, number>) =>
          params.row.money ? currency(params.row.money) : ''
      },
      {
        field: 'dateRefund',
        headerName: 'Ngày hoàn ứng',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryRefundType, number>) =>
          params.row.dateRefund ? moment(params.row.dateRefund).format('DD/MM/YYYY') : ''
      },
      {
        field: 'statusRefund',
        headerName: 'TT Hoàn ứng',
        flex: 1,
        renderCell: (params: GridRenderCellParams<SalaryRefundType, number>) => {
          const show = STATUS_ADVANCE_SALARY.find((e) => e.value === params.row.statusRefund)?.label
          return show || ''
        }
      },
      {
        field: 'actions',
        headerName: '',
        type: 'actions',
        getActions: (param: GridRenderCellParams<SalaryRefundType, number>) => {
          return [
            <GridActionsCellItem
              onClick={() => handleDelete(param.row.id)}
              icon={
                <Tooltip title='Xóa'>
                  <DeleteOutlinedIcon />
                </Tooltip>
              }
              label='Xóa'
              className='textPrimary'
              color='inherit'
              // showInMenu
            />
          ]
        }
      }
    ]
  }

  const renderColumn = (colDef: { field: string; headerName: string }) => {
    switch (colDef.field) {
      default:
        return {
          ...colDef
        }
    }
  }

  const columns: GridColDef[] = useMemo(() => data.columns?.map((colDef) => renderColumn(colDef)), [data.columns])

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    defaultValues: {
      statusRefund: 'WAITING_ACCEPT',
      dateRefund: dayjs(new Date()).toString(),
      money: needPaid
    },
    resolver: yupResolver(validationSchema)
  })

  const onSubmit: SubmitHandler<FormValues> = (value) => {
    const date = moment(value.dateRefund).startOf('day')
    const isoDateStr = date?.toISOString()
    if (itemSelectedEdit?.id)
      return editSalaryRefund({
        ...value,
        id: itemSelectedEdit.id,
        dateRefund: isoDateStr,
        salaryAdvanceId: itemSelectedSalaryAdvance?.id
      })
    addSalaryRefund({
      ...value,
      dateRefund: isoDateStr,
      salaryAdvanceId: itemSelectedSalaryAdvance?.id
    })
  }

  const closeModal = () => {
    handleClose()
    // setRowsData([])
  }

  const RenderTitle = () => {
    const data = fetchDataAdvance?.data
    const nameEmployee = data?.employeeId
      ? (data.employee.name || '') +
        ' - ' +
        (data.employee.phoneNumber || '') +
        ' - ' +
        (data.employee.identificationCard || '')
      : null
    const nameStaff = data?.staffId
      ? (data.staff.name || '') + ' - ' + (data.staff.phoneNumber || '') + ' - ' + (data.staff.identificationCard || '')
      : null
    return `Hoàn ứng (${nameEmployee || nameStaff || ''})`
  }

  const handleDelete = async (id: number) => {
    const confirmed = await dialogs.confirm('Bạn có chắc chắn không?', {
      title: 'Xác nhận lại',
      okText: 'Có',
      cancelText: 'Hủy'
    })
    if (confirmed) {
      deleteSalaryRefund({ ids: [Number(id)] })
    }
  }

  const handleMutation = (
    loading: boolean,
    isError: boolean,
    isSuccess: boolean,
    successMessage: string,
    errorMessage: string
  ) => {
    if (isSuccess) {
      handleSave()
      refetch()
      reset()
      clearErrors()
    }
    if (!loading) {
      isError && Toast({ text: errorMessage, variant: 'error' })
      isSuccess && Toast({ text: successMessage, variant: 'success' })
    }
  }

  useEffect(() => {
    handleMutation(loadingDelete, isError, isSuccess, 'Thao tác thành công', 'Thao tác không thành công')
  }, [loadingDelete])

  useEffect(() => {
    if (!loadingAdd && isErrorAdd) {
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
    handleMutation(loadingAdd, isErrorAdd, isSuccessAdd, 'Thêm mới thành công', 'Thêm mới không thành công')
  }, [loadingAdd])

  useEffect(() => {
    if (!loadingEdit && isErrorEdit) {
      const newError = errorEdit as {
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
    handleMutation(loadingEdit, isErrorEdit, isSuccessEdit, 'Cập nhật thành công', 'Cập nhật không thành công')
  }, [loadingEdit])

  useEffect(() => {
    if (!isLoading && fetchData?.data) {
      const newData = fetchData?.data
      setValue('money', newData?.money || '')
      setValue('dateRefund', dayjs(newData?.dateRefund).toString())
      setValue('noteRefund', newData?.noteRefund || '')
      setValue('statusRefund', newData?.statusRefund)
    }
  }, [isLoading, fetchData, open])

  useEffect(() => {
    // Xử lý việc cập nhật lại thứ tự sau khi dữ liệu được tải về
    const updatedRows =
      fetchDataAdvance?.data?.salaryRefunds?.map((row: SalaryAdvanceType) => ({
        ...row
      })) || []
    setRowsData(updatedRows)
  }, [fetchDataAdvance])

  useEffect(() => {
    if (!itemSelectedEdit?.id) {
      reset()
      setValue('money', needPaid >= 0 ? needPaid : 0)
    }
  }, [open, needPaid])

  useEffect(() => {
    if (itemSelectedEdit?.id && open) {
      refetchRefund()
    }
    if (itemSelectedSalaryAdvance?.id && open) {
      refetch()
    }
  }, [open, itemSelectedEdit?.id, refetch, refetchRefund])

  return (
    <CustomDialog title={RenderTitle()} open={open} onClose={closeModal} maxWidth='lg' fullWidth>
      <Grid container spacing={8}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={gridSpacingForm} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <MyTextField
                  name='money'
                  control={control}
                  label='Số tiền'
                  errors={errors}
                  textFieldProps={{ placeholder: 'Nhập dữ liệu ở đây' }} // Truyền các props tùy chọn cho TextField
                  InputProps={{
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    inputComponent: NumericFormatCustom as any
                    /* eslint-enable @typescript-eslint/no-explicit-any */
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <MyDatePicker
                  name='dateRefund'
                  control={control}
                  label='Ngày'
                  errors={errors}
                  variant='standard'
                  //   defaultValue={dayjs()}
                />
              </Grid>
              {/* <Grid item xs={12} sm={12} md={12} lg={6}>
            <MySelect name='isRefund' control={control} label='Hoàn ứng' errors={errors} options={OPTION_COMPLETION} />
          </Grid> */}
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <MySelect
                  name='statusRefund'
                  control={control}
                  label='Tình trạng hoàn ứng'
                  errors={errors}
                  options={STATUS_ADVANCE_SALARY}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <MyTextField name='noteRefund' control={control} label='Ghi chú' errors={errors} />
              </Grid>
            </Grid>
            <Grid container spacing={gridSpacingForm} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MyButton variant='outlined' sx={{ float: 'right', ml: 1 }} onClick={closeModal}>
                  Hủy
                </MyButton>
                <SubmitButton variant='outlined' sx={{ float: 'right' }} loading={isSubmitting}>
                  Lưu
                </SubmitButton>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <div style={{ width: '100%', overflow: 'auto', marginTop: '20px' }}>
            <TableDataGrid
              rows={rows}
              columns={columns}
              isLoading={isLoadingAdvance}
              filterMode='server'
              headerFilters={false}
              paginationModel={{
                pageSize: 1000,
                page: 1
              }}
              setPaginationModel={() => {
                return
              }}
              totalCount={rows?.length || 0}
              // otherProps={{
              //   getRowClassName: (params: GridRenderCellParams<SalaryAdvanceType, number>) =>
              //     !params.row.isActive ? 'even' : 'odd'
              // }}
            />
          </div>
        </Grid>
      </Grid>
      <LoadingModal open={isLoading || isLoadingAdvance} />
    </CustomDialog>
  )
}
