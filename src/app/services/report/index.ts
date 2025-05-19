import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { GET } from '../../../common/contants'
import { ReponseData2 } from '../../../types'
import { axiosBaseQuery } from '../../baseQuery'

export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['report'],
  endpoints: (builder) => ({
    exportDetailOrder: builder.query<Blob, { month: string }>({
      query: (params) => ({
        url: NetWork.exportDetailOrder,
        method: GET,
        params,
        responseType: 'blob' // 👈 Cực kỳ quan trọng!
      }),
      transformResponse: (response: any) => response
    }),
    exportBySaleOrder: builder.query<Blob, { month: string }>({
      query: (params) => ({
        url: NetWork.exportDetailOrder,
        method: GET,
        params,
        responseType: 'blob' // 👈 Cực kỳ quan trọng!
      }),
      transformResponse: (response: any) => response
    }),
    getListReportOrder: builder.query({
      query: (params) => ({
        url: NetWork.reportOrder,
        method: GET,
        params: params
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useExportDetailOrderQuery,
  useLazyExportDetailOrderQuery,
  useLazyExportBySaleOrderQuery,
  useGetListReportOrderQuery
} = reportApi
