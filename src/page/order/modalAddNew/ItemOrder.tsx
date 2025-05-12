import { Button, Card, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { RiAddLine, RiDeleteBin7Line } from '@remixicon/react'
import { COLORS } from '../../../common/colors'
import MyTextField from '../../../components/input/MyTextField'
import { Control, FieldArrayWithId, FieldErrors, UseFormSetValue, useWatch } from 'react-hook-form'
// import MyRadio from '../../../components/radio'
// import { useGetListCurrencyQuery } from '../../../app/services/currency'
import { FormValuesOrder } from '../../../types/order'
import MyAutocompleteFreeSolo from '../../../components/select/MyAutocompleteFreeSolo'
import { useEffect } from 'react'
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  errors: FieldErrors<FormValuesOrder>
  control: Control<FormValuesOrder, any>
  fieldsItemOrders: FieldArrayWithId<FormValuesOrder, 'products', 'id'>[]
  handleAddItemOrder: () => void
  handleDeleteItemOrder: (index: number) => void
  setValue: UseFormSetValue<FormValuesOrder>
} /* eslint-enable @typescript-eslint/no-explicit-any */

const selectOptions = [
  { value: 'wig', label: 'wig' },
  { value: 'bundles', label: 'bundles' },
  { value: 'pieces', label: 'pieces' },
  { value: 'kg', label: 'kg' }
]

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
                  <MyAutocompleteFreeSolo
                    title='Đơn vị'
                    name={`products.${index}.unit`}
                    control={control}
                    // label='Pick or type a value'
                    errors={errors}
                    options={selectOptions} //Object là object[] hoặc string[]
                    // mb={2}
                    textFieldProps={{
                      variant: 'outlined'
                    }}
                    freeSolo
                    placeholder='Nhập đơn vị'
                    size='small'
                    require
                    onChange={(_, value) => {
                      console.log(value)

                      // setValue('address', value?.address || '')
                      // setValue('phoneNumber', value?.phoneNumber || '')
                    }}
                    messageErrors={errors?.products?.[index]?.unit?.message}
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
