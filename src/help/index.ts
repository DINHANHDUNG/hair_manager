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
