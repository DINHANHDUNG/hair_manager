import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { GET } from '../../../common/contants'
import { ReponseData2 } from '../../../types'
import { axiosBaseQuery } from '../../baseQuery'
import {
  StaticEmployeeByMonthType,
  StaticSalaryAdvanceType,
  StaticStaffTotalType,
  StaticStatusEmployeeType,
  StaticStatusStaffType
} from '../../../types/statistic'

export const statisticApi = createApi({
  reducerPath: 'statisticApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['statistic'],
  endpoints: (builder) => ({
    getStaticStaffTotal: builder.query({
      query: (params) => ({
        url: NetWork.staticStaffTotal,
        method: GET,
        params: params
      }),
      transformResponse: (response: ReponseData2<StaticStaffTotalType>) => response
    }),
    getStaticStaffDetail: builder.query({
      query: (params) => ({
        url: NetWork.staticStaffDetail,
        method: GET,
        params: params
      }),
      transformResponse: (response: ReponseData2<StaticStatusStaffType>) => response
    }),
    getStatisticEmployeeTotal: builder.query({
      query: (params) => ({
        url: NetWork.staticEmployeeTotal,
        method: GET,
        params: params
      }),
      transformResponse: (response: ReponseData2<StaticStaffTotalType>) => response
    }),
    getStaticEmployeeDetail: builder.query({
      query: (params) => ({
        url: NetWork.staticEmployeeDetail,
        method: GET,
        params: params
      }),
      transformResponse: (response: ReponseData2<StaticStatusEmployeeType>) => response
    }),
    getStaticSalaryAdvance: builder.query({
      query: (params) => ({
        url: NetWork.staticSalaryAdvance,
        method: GET,
        params: params
      }),
      transformResponse: (response: ReponseData2<StaticSalaryAdvanceType>) => response
    }),
    getStaticEmployeeByMonth: builder.query({
      query: (params) => ({
        url: NetWork.staticEmployeeByMonth,
        method: GET,
        params: params
      }),
      transformResponse: (response: ReponseData2<StaticEmployeeByMonthType[]>) => response
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetStaticStaffTotalQuery,
  useGetStatisticEmployeeTotalQuery,
  useGetStaticStaffDetailQuery,
  useGetStaticEmployeeDetailQuery,
  useGetStaticSalaryAdvanceQuery,
  useGetStaticEmployeeByMonthQuery
} = statisticApi
