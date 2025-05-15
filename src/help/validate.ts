import * as yup from 'yup'
import { VALIDATE } from '../common/validate'

export const requiredString = (fieldName?: string) =>
  yup
    .string()
    .required(`Trường ${fieldName || 'này'} là bắt buộc`)
    .max(255, `Độ dài không được quá 255`)

export const conditionalRequiredString = (fieldName?: string, keyCheck?: string, is: unknown = true) =>
  yup.string().when(keyCheck || '', {
    is: is,
    then: (schema) => schema.required(`Trường ${fieldName || 'này'} là bắt buộc`).max(255, `Độ dài không được quá 255`),
    otherwise: (schema) => schema.notRequired().max(255, `Độ dài không được quá 255`)
  })
