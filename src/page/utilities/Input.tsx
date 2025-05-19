import React, { useEffect } from 'react'
// material-ui
import Grid from '@mui/material/Grid'
// project imports
import { yupResolver } from '@hookform/resolvers/yup'
import { FormControl, Input, InputLabel, TextField } from '@mui/material'
import dayjs from 'dayjs'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { VALIDATE } from '../../common/validate'
import SubmitButton from '../../components/button/SubmitButton'
import MyDatePicker from '../../components/dateTime/MyDatePicker'
import MyTimeField from '../../components/dateTime/MyTimeField'
import { NumericFormatCustom, TextMaskCustom } from '../../components/input'
import MyTextField from '../../components/input/MyTextField'
import MyAutocompleteFreeSolo from '../../components/select/MyAutocompleteFreeSolo'
import MySelect from '../../components/select/MySelect'
import MyTextFieldSelect from '../../components/select/MyTextFieldSelect'
import SecondaryAction from '../../components/ui-component/cards/CardSecondaryAction'
import MainCard from '../../components/ui-component/cards/MainCard'
import SubCard from '../../components/ui-component/cards/SubCard'
import { gridSpacing } from '../../constants'
// Định nghĩa schema xác thực với yup
const validationSchema = yup.object({
  myField: yup.string().required('Trường này là bắt buộc').min(3, 'Tối thiểu 3 ký tự'),
  mySelect: yup.string().required('Trường này là bắt buộc'),
  mySelectTextField: yup.string().required('Trường này là bắt buộc'),
  myTimeField: yup.string().required('Trường này là bắt buộc').matches(VALIDATE.hour, 'Vui lòng nhập đúng định dạng'),
  myFieldAutoComplate: yup.object().required('Trường này là bắt buộc'),
  myDateField: yup.string().required('Trường này là bắt buộc'),
  myFieldNumber: yup.string().required('Trường này là bắt buộc'),
  // myFieldAutoComplateFreeSolo: yup.string().required('Trường này là bắt buộc'),
  myFieldAutoComplateFreeSolo2: yup.string().required('Trường này là bắt buộc')
})

type FormValues = {
  myField: string
  mySelect: string
  mySelectTextField: string
  myTimeField: string
  myFieldAutoComplate: object
  myDateField: string
  myFieldNumber: string
  // myFieldAutoComplateFreeSolo: string
  myFieldAutoComplateFreeSolo2: string
}

const InputUtilities = () => {
  const [values, setValues] = React.useState({
    textmask: '(100) 000-0000',
    numberformat: '1320'
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    })
  }

  //FORM

  // Danh sách các tùy chọn cho MySelect
  const selectOptions = [
    { value: 'option1', label: 'Tùy chọn 1' },
    { value: 'option2', label: 'Tùy chọn 2' },
    { value: 'option3', label: 'Tùy chọn 3' }
  ]
  // Khởi tạo react-hook-form với schema xác thực
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  })

  // Xử lý khi form được submit
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data)
  }

  useEffect(() => {
    setTimeout(() => {
      setValue('myField', 'abc')
      setValue('mySelect', 'option2')
      setValue('myTimeField', dayjs('2022-04-17T15:30').toString())
      setValue('myFieldAutoComplate', { value: 'option3', label: 'Tùy chọn 3' })
    }, 3000)
  }, [setValue])

  return (
    <MainCard title='Input' secondary={<SecondaryAction link='https://next.material-ui.com/system/palette/' />}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard title='Input Format'>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FormControl variant='standard'>
                  <InputLabel htmlFor='formatted-text-mask-input'>react-imask</InputLabel>
                  <Input
                    value={values.textmask}
                    onChange={handleChange}
                    name='textmask'
                    id='formatted-text-mask-input'
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    inputComponent={TextMaskCustom as any}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <TextField
                  label='react-number-format'
                  value={values.numberformat}
                  onChange={handleChange}
                  name='numberformat'
                  id='formatted-numberformat-input'
                  InputProps={{
                    inputComponent: NumericFormatCustom as any
                  }}
                  variant='standard'
                />
              </Grid>
            </Grid>
          </SubCard>
          <SubCard title='Form' sx={{ mt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <MyTextField
                    name='myField'
                    control={control}
                    label='Tên trường'
                    errors={errors}
                    textFieldProps={{ placeholder: 'Nhập dữ liệu ở đây' }} // Truyền các props tùy chọn cho TextField
                    sx={{ mb: 2 }}
                    variant='standard'
                  />
                  <MyTextField
                    name='myFieldNumber'
                    control={control}
                    label='Tên trường'
                    errors={errors}
                    textFieldProps={{ placeholder: 'Nhập dữ liệu ở đây' }} // Truyền các props tùy chọn cho TextField
                    sx={{ mb: 2 }}
                    InputProps={{
                      inputComponent: NumericFormatCustom as any
                      /* eslint-enable @typescript-eslint/no-explicit-any */
                    }}
                    variant='standard'
                  />
                  <MySelect
                    name='mySelect'
                    control={control}
                    label='Chọn tùy chọn'
                    errors={errors}
                    options={selectOptions}
                    mb={2}
                    variant='standard'
                  />
                  <MyTextFieldSelect
                    name='mySelectTextField'
                    control={control}
                    label='Select TextField an Option'
                    errors={errors}
                    options={selectOptions}
                    textFieldProps={{
                      variant: 'standard'
                    }}
                    mb={2}
                  />
                  {/* <MyAutocomplete
                    name='myFieldAutoComplate'
                    control={control}
                    label='Select an option'
                    errors={errors}
                    options={selectOptions}
                    sx={{ mb: 2 }}
                    textFieldProps={{
                      variant: 'standard'
                    }}
                    isOptionEqualToValue={(option, value) => {
                      return option.value === value.value
                    }}
                    // onChange={(_, value) => {
                    //   setValue('myFieldAutoComplate', value?.value || ''); // Lưu giá trị hoặc một chuỗi trống nếu không có giá trị
                    // }}
                  /> */}

                  {/* <MyAutocomplete
                    freeSolo={true}
                    name='myFieldAutoComplateFreeSolo'
                    control={control}
                    label='Select Free solo an option'
                    errors={errors}
                    options={selectOptions}
                    sx={{ mb: 2 }}
                    textFieldProps={{
                      variant: 'standard'
                    }}
                    getOptionLabel={(option) => option.label}
                    onInputChange={(_, data) => {
                      if (data) setValue('myFieldAutoComplateFreeSolo', data)
                    }}
                    onChange={(_, data: any) => {
                      console.log('data', data)

                      setValue('myFieldAutoComplateFreeSolo', data?.value)
                    }}
                  /> */}

                  <MyAutocompleteFreeSolo
                    name='myFieldAutoComplateFreeSolo2'
                    control={control}
                    label='Pick or type a value'
                    errors={errors}
                    options={selectOptions} //Object là object[] hoặc string[]
                    mb={2}
                    textFieldProps={{
                      variant: 'standard'
                    }}
                    onChange={(_, value) => {
                      setValue('myFieldAutoComplateFreeSolo2', value?.value || '') // Lưu giá trị hoặc một chuỗi trống nếu không có giá trị
                    }}
                  />

                  <MyTimeField
                    name='myTimeField'
                    control={control}
                    label='Chọn giờ'
                    errors={errors}
                    sx={{ mb: 2 }}
                    format='HH:mm'
                    variant='standard'
                    // defaultValue={dayjs('2022-04-17T15:30')}
                  />

                  <MyDatePicker
                    name='myDateField'
                    control={control}
                    label='Pick a date'
                    errors={errors}
                    defaultValue={dayjs()}
                    mb={2}
                    format='DD/MM'
                    variant='standard'
                  />
                  <SubmitButton
                    sx={{ float: 'right' }}
                    loading={isSubmitting} // Hiển thị trạng thái tải khi đang submit
                  >
                    Gửi
                  </SubmitButton>
                </form>
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default InputUtilities
