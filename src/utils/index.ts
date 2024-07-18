import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const getToken = (name: string): string | undefined => cookies.get(name, { doNotParse: true })

export const setToken = (name: string, value: string, age: number): void =>
  cookies.set(name, value, { path: '/', maxAge: age })

export const removeToken = (name: string): void => cookies.remove(name, { path: '/' })
