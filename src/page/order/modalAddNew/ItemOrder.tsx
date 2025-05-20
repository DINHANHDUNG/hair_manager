import { Button, Grid, Stack, Typography } from '@mui/material'
import { RiAddLine, RiDeleteBin7Line } from '@remixicon/react'
import { Control, FieldArrayWithId, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { COLORS } from '../../../common/colors'
import MyTextField from '../../../components/input/MyTextField'
// import MyRadio from '../../../components/radio'
// import { useGetListCurrencyQuery } from '../../../app/services/currency'
import { OPTIONS_UNIT } from '../../../common/contants'
import MyAutocomplete from '../../../components/select/MyAutocomplete'
import { FormValuesOrder } from '../../../types/order'
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  errors: FieldErrors<FormValuesOrder>
  control: Control<FormValuesOrder, any>
  fieldsItemOrders: FieldArrayWithId<FormValuesOrder, 'products', 'id'>[]
  handleAddItemOrder: () => void
  handleDeleteItemOrder: (index: number) => void
  setValue: UseFormSetValue<FormValuesOrder>
} /* eslint-enable @typescript-eslint/no-explicit-any */

export default function ItemOrder(props: Props) {
  // const permEdit = useHasPermission(Perm_Customer_PaymentAccount_Edit || [])
  const { errors, fieldsItemOrders, control, handleAddItemOrder, handleDeleteItemOrder, setValue } = props
  return (
    <>
      {fieldsItemOrders?.map((field, index) => {
        return (
          <Grid item xs={12} sm={12} md={12} lg={12} key={field.id} sx={{ mb: 1 }}>
            <Stack
              direction='row'
              spacing={2}
              sx={{
                backgroundColor: COLORS.gray,
                padding: '16px',
                paddingLeft: '6px',
                paddingTop: '6px',
                borderRadius: '12px'
              }}
            >
              <Grid container direction={'row'} spacing={1.5} key={field?.id}>
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ mb: 1 }}>
                  <Stack direction='row' justifyContent={'space-between'} alignItems={'center'} spacing={2}>
                    <Typography variant='h5' style={{ color: COLORS.textInput }}>
                      Thông tin đơn hàng {index + 1}
                    </Typography>
                    <Button
                      sx={{ padding: 0 }}
                      onClick={() => (index === 0 ? handleAddItemOrder() : handleDeleteItemOrder(index))}
                    >
                      <Typography
                        variant='h6'
                        style={{
                          color: index === 0 ? COLORS.main : COLORS.red,
                          fontWeight: '400',
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {index === 0 ? (
                          <>
                            <RiAddLine size={18} style={{ marginRight: '5px' }} /> Thêm thông tin đơn hàng
                          </>
                        ) : (
                          <>
                            <RiDeleteBin7Line size={18} style={{ marginRight: '5px' }} /> Xóa thông tin đơn hàng
                          </>
                        )}
                      </Typography>
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <MyTextField
                    name={`products.${index}.name`}
                    control={control}
                    errors={errors}
                    title='Tên hàng hoá'
                    variant='outlined'
                    size='small'
                    placeholder='Nhập tên hàng hoá'
                    require
                    messageErrors={errors?.products?.[index]?.name?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <MyTextField
                    name={`products.${index}.size`}
                    control={control}
                    errors={errors}
                    title='Kích thước'
                    variant='outlined'
                    size='small'
                    placeholder='Nhập kích thước'
                    require
                    messageErrors={errors?.products?.[index]?.size?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <MyTextField
                    name={`products.${index}.quantity`}
                    control={control}
                    errors={errors}
                    title='Số lượng'
                    variant='outlined'
                    size='small'
                    placeholder='Nhập số lượng'
                    require
                    messageErrors={errors?.products?.[index]?.quantity?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <MyAutocomplete
                    title='Đơn vị'
                    name={`products.${index}.unit`}
                    control={control}
                    errors={errors}
                    options={OPTIONS_UNIT ?? []}
                    placeholder='Chọn đơn vị'
                    size='small'
                    fullWidth
                    require
                    messageErrors={errors?.products?.[index]?.unit?.message}
                    onChange={(_, v) => {
                      /* eslint-disable @typescript-eslint/no-explicit-any */
                      const selectedValue = v as any // Ép kiểu cho giá trị v
                      /* eslint-enable @typescript-eslint/no-explicit-any */
                      setValue(`products.${index}.unit`, selectedValue ? selectedValue?.value?.toString() : '') // set đúng giá trị của `value`
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <MyTextField
                    name={`products.${index}.price`}
                    control={control}
                    errors={errors}
                    title='Đơn giá'
                    variant='outlined'
                    size='small'
                    placeholder='Nhập đơn giá'
                    require
                    messageErrors={errors?.products?.[index]?.price?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <MyTextField
                    name={`products.${index}.money`}
                    control={control}
                    errors={errors}
                    title='Thành tiền'
                    variant='outlined'
                    size='small'
                    placeholder='Nhập thành tiền'
                    require
                    InputProps={{ readOnly: true }}
                    messageErrors={errors?.products?.[index]?.money?.message}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        )
      })}
    </>
  )
}
