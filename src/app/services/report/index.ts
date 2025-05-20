import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { GET } from '../../../common/contants'
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
      /* eslint-disable @typescript-eslint/no-explicit-any */
      transformResponse: (response: any) => response
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }),
    exportBySaleOrder: builder.query<Blob, { month: string }>({
      query: (params) => ({
        url: NetWork.exportBySaleOrder,
        method: GET,
        params,
        responseType: 'blob' // 👈 Cực kỳ quan trọng!
      }),
      /* eslint-disable @typescript-eslint/no-explicit-any */
      transformResponse: (response: any) => response
      /* eslint-enable @typescript-eslint/no-explicit-any */
    }),
    getListReportOrder: builder.query({
      query: (params) => ({
        url: NetWork.reportOrder,
        method: GET,
        params: params
      })
    }),
    getListReportOrderSale: builder.query({
      query: (params) => ({
        url: NetWork.reportOrderSale,
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
  useGetListReportOrderQuery,
  useGetListReportOrderSaleQuery
} = reportApi
