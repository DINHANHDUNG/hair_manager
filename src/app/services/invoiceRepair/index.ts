import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, POST, PUT } from '../../../common/contants'
import { axiosBaseQuery } from '../../baseQuery'
// import { ReponseData } from '../../types'

export const invoiceRepairApi = createApi({
  reducerPath: 'invoiceRepairApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['InvoiceRepair', 'DetailInvoiceRepair'], // Đảm bảo tagType là 'InvoiceRepair'
  endpoints: (builder) => ({
    getListInvoiceRepair: builder.query({
      query: (params) => ({
        url: NetWork.invoiceRepair,
        method: GET,
        params: params
      }),
      providesTags: (result) => (result ? [{ type: 'InvoiceRepair', id: 'LIST' }] : [])
    }),
    getInvoiceRepairById: builder.query({
      query: (params: { invoiceRepairId: number }) => ({
        url: NetWork.invoiceRepairId(params.invoiceRepairId),
        method: GET
      }),
      providesTags: (result) => (result ? [{ type: 'DetailInvoiceRepair', id: 'DETAIL' }] : [])
    }),
    addInvoiceRepair: builder.mutation({
      query: (data) => ({
        url: NetWork.invoiceRepair,
        method: POST,
        data: data
      }),
      invalidatesTags: [{ type: 'InvoiceRepair', id: 'LIST' }]
    }),
    updateInvoiceRepair: builder.mutation({
      query: (data) => ({
        url: NetWork.invoiceRepairId(data.id),
        method: PUT,
        data: data
      }),
      invalidatesTags: [{ type: 'InvoiceRepair', id: 'LIST' }]
    }),
    deleteInvoiceRepair: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.invoiceRepair,
        method: DELETE,
        data: data
        // invalidatesTags: [{ type: 'InvoiceRepair', id: 'LIST' }] // Vô hiệu hóa tag 'InvoiceRepair' với id 'LIST' để gọi lại getListInvoiceRepair
      }),
      invalidatesTags: [{ type: 'InvoiceRepair', id: 'LIST' }]
    }),
    uploadFileInvoiceRepair: builder.mutation({
      query: (data) => ({
        url: NetWork.invoiceRepairUpload,
        method: POST,
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListInvoiceRepairQuery,
  useDeleteInvoiceRepairMutation,
  useAddInvoiceRepairMutation,
  useGetInvoiceRepairByIdQuery,
  useUpdateInvoiceRepairMutation,
  useUploadFileInvoiceRepairMutation
} = invoiceRepairApi
