import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { GET } from '../../../common/contants'
import { ReponseData2 } from '../../../types'
import { axiosBaseQuery } from '../../baseQuery'
import { statisticStaffTotalType } from '../../../types/statistic'

export const statisticApi = createApi({
  reducerPath: 'statisticApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['statistic'],
  endpoints: (builder) => ({
    getStaticStaffTotal: builder.query({
      query: (params) => ({
        url: NetWork.statisticStaffTotal,
        method: GET,
        params: params
      }),
      transformResponse: (response: ReponseData2<statisticStaffTotalType>) => response
    })
  })
})

// Export hooks for usage in functional components
export const { useGetStaticStaffTotalQuery } = statisticApi
