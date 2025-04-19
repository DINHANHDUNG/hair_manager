import * as yup from 'yup'
import { VALIDATE } from '../../../common/validate'
import { requiredString } from '../../../help/validate'

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
