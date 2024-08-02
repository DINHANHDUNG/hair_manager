import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { API_URL, NetWork } from '../../common/apiKey'
import { setCredentials, logout } from '../features/auth/authSlice'
import { RootState } from '../store'

const axiosInstance = axios.create({
  baseURL: API_URL
})

export const axiosBaseQuery: BaseQueryFn<
  {
    url: string
    method?: AxiosRequestConfig['method']
    data?: AxiosRequestConfig['data']
    params?: AxiosRequestConfig['params']
    headers?: AxiosRequestConfig['headers']
  },
  unknown,
  unknown
> = async ({ url, method, data, params, headers }, { getState, dispatch }) => {
  const state = getState() as RootState
  const token = state.auth.accessToken

  try {
    const result = await axiosInstance({
      url,
      method,
      data,
      params,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return { data: result.data }
  } catch (axiosError) {
    const err = axiosError as AxiosError

    if (err.response?.status === 401 && url != NetWork.login) {
      // try to get a new token
      try {
        console.log('Token expired, refreshing token...')
        const refreshResult = await axiosInstance.post(NetWork.refresh_token, {
          refreshToken: state.auth.refreshToken
        })

        if (refreshResult.data) {
          const newAccessToken = refreshResult.data.data.accessToken

          // store the new token
          dispatch(setCredentials(refreshResult.data))

          // retry the original query with new token
          const retryResult = await axiosInstance({
            url,
            method,
            data,
            params,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
              'Content-Type': 'application/json'
            }
          })
          return { data: retryResult.data }
        } else {
          dispatch(logout())
        }
      } catch (refreshError) {
        const refreshErr = refreshError as AxiosError
        return {
          error: {
            status: refreshErr.response?.status,
            data: refreshErr.response?.data || refreshErr.message
          }
        }
      }
    }

    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message
      }
    }
  }
}
