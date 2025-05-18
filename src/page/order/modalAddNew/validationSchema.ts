import * as yup from 'yup'
import { VALIDATE } from '../../../common/validate'
import { conditionalRequiredString, requiredString } from '../../../help/validate'

const itemOrderSchema = yup.object().shape({
  name: requiredString(),
  size: requiredString(),
  quantity: requiredString(),
  unit: requiredString(),
  price: requiredString(),
  money: requiredString()
})

export const validationSchemaOrder = yup.object({
  dateOrder: yup.string().when('$idOrder', {
    is: (val: any) => !val,
    then: (schema) =>
      schema
        .required(`Trường này là bắt buộc`)
        .max(255, `Độ dài không được quá 255`)
        .matches(VALIDATE.dateRegex, 'Vui lòng nhập đúng định dạng'),
    otherwise: (schema) => schema.notRequired().max(255, `Độ dài không được quá 255`)
  }),
  customerId: conditionalRequiredString(undefined, '$idOrder', false),
  // customerId: requiredString(),
  code: conditionalRequiredString(undefined, '$idOrder'),
  customerAddress: conditionalRequiredString(undefined, '$idOrder', false),
  customerPhone: yup.string().when('$idOrder', {
    is: false,
    then: (schema) =>
      schema
        .required(`Trường này là bắt buộc`)
        .transform((value, originalValue) => (originalValue === '' ? undefined : value))
        .max(255, `Độ dài không được quá 255`)
        .matches(VALIDATE.phoneRelaxed, 'Số điện thoại không đúng định dạng'),
    otherwise: (schema) => schema.notRequired().max(255, `Độ dài không được quá 255`)
  }),
  discount: conditionalRequiredString(undefined, '$idOrder', false),

  products: yup.array().of(itemOrderSchema)
})
