import * as yup from 'yup'
import { VALIDATE } from '../../../common/validate'

const requiredString = (fieldName?: string) =>
  yup
    .string()
    .required(`Trường ${fieldName || 'này'} là bắt buộc`)
    .max(255, `Độ dài không được quá 255`)

const conditionalRequiredString = (fieldName?: string, keyCheck?: string) =>
  yup.string().when(keyCheck || '', {
    is: true,
    then: (schema) => schema.required(`Trường ${fieldName || 'này'} là bắt buộc`).max(255, `Độ dài không được quá 255`),
    otherwise: (schema) => schema.notRequired().max(255, `Độ dài không được quá 255`)
  })

const contactSchema = yup.object().shape({
  name: yup.string().max(255, 'Độ dài không được quá 255'),
  phoneNumber: yup
    .string()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    // .required('Trường này là bắt buộc')
    .matches(VALIDATE.phoneRegex, 'Số điện thoại không đúng định dạng'),
  email: yup.string().email('Vui lòng nhập đúng định dạng email'),
  position: yup.string().max(255, 'Độ dài không được quá 255')
})

const warehouseSchema = yup.object().shape({
  code: requiredString('mã kho'),
  name: requiredString('tên kho'),
  personName: requiredString('tên người phụ trách'),
  personPhoneNumber: yup
    .string()
    .required('Trường này là bắt buộc')
    .matches(VALIDATE.phoneRegex, 'Số điện thoại không đúng định dạng'),
  note: yup.string().max(255, 'Độ dài không được quá 255'),
  address: requiredString('địa chỉ'),
  location: yup.string().max(255, 'Độ dài không được quá 255')
})

// const bankAccountSchema = yup.object().shape({
//   typeAccount: requiredString('loại tài khoản'),
//   bankName: requiredString('tên ngân hàng'),
//   bankNumber: requiredString('số tài khoản'),
//   personNumber: requiredString('chủ tài khoản'),
//   paymentId: yup
//     .number()
//     .transform((value, originalValue) => (originalValue === 0 ? undefined : value))
//     .required('Trường này là bắt buộc'),
//   isActive: yup.boolean().required('Trường này là bắt buộc')
// })

const itemOrderSchema = yup.object().shape({
  name: requiredString(),
  size: requiredString(),
  quantity: requiredString(),
  unit: requiredString(),
  unitPrice: requiredString(),
  money: requiredString()
})

export const validationSchemaOrder = yup.object({
  fullName: requiredString(),
  dateOrder: yup
    .string()
    .required(`Trường này là bắt buộc`)
    .max(255, `Độ dài không được quá 255`)
    .matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  address: requiredString(),
  phoneNumber: yup
    .string()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .matches(VALIDATE.phoneRegex, 'Số điện thoại không đúng định dạng'),
  // taxCode: yup.string().required('Mã số thuế là bắt buộc').matches(VALIDATE.taxCode, 'Mã số thuế không đúng định dạng'),

  itemOrders: yup.array().of(itemOrderSchema)
})
