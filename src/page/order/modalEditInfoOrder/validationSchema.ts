import * as yup from 'yup'
import { VALIDATE } from '../../../common/validate'
import { requiredString } from '../../../help/validate'

const itemOrderSchema = yup.object().shape({
  name: requiredString(),
  size: requiredString(),
  quantity: requiredString(),
  unit: requiredString(),
  price: requiredString(),
  money: requiredString()
})

export const validationSchemaOrder = yup.object({
  dateOrder: yup
    .string()
    .required(`Trường này là bắt buộc`)
    .max(255, `Độ dài không được quá 255`)
    .matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
  customerId: requiredString(),
  code: requiredString(),
  customerAddress: requiredString(),
  customerPhone: yup
    .string()
    .required(`Trường này là bắt buộc`)
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .matches(VALIDATE.phoneRelaxed, 'Số điện thoại không đúng định dạng'),
  discount: requiredString(),

  products: yup.array().of(itemOrderSchema)
})
