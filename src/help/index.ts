import dayjs from 'dayjs'

export const convertDateToApi = (value: Date | string) => {
  const date = dayjs(value).format()
  return date || ''
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function removeNullOrEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {}

  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== '') {
      result[key] = obj[key]
    }
  }

  return result
}

export const convertDataLabelAutoComplate = ({
  data,
  key,
  value,
  subKey
}: {
  data: any
  key: string
  value: string
  subKey?: string
}) => {
  const newData = data.map((e: any) => ({
    ...e,
    label: (e?.[key] || '') + (subKey ? `- ${e?.[subKey]}` : ''),
    value: e?.[value].toString() || ''
  }))
  return newData || []
}
