import * as yup from 'yup'
import { VALIDATE } from '../common/validate'

export const requiredString = (fieldName?: string) =>
  yup
    .string()
    .required(`Trường ${fieldName || 'này'} là bắt buộc`)
    .max(255, `Độ dài không được quá 255`)
