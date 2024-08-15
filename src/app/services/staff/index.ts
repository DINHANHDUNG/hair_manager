import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, PATCH, POST, PUT } from '../../../common/contants'
import { axiosBaseQuery } from '../../baseQuery'
import { ReponseData2 } from '../../../types'
import { StaffType } from '../../../types/staff'
// import { ReponseData } from '../../types'

export const staffApi = createApi({
  reducerPath: 'staffApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Staff'], // Đảm bảo tagType là 'Staff'
  endpoints: (builder) => ({
    getListStaff: builder.query({
      query: (params) => ({
        url: NetWork.staff,
        method: GET,
        params: params,
        providesTags: (result: ReponseData2<{ rows: StaffType[] }>) => (result ? [{ type: 'Staff', id: 'LIST' }] : []) // Cung cấp tag 'Staff' với id 'LIST'
      })
    }),
    getStaffById: builder.query({
      query: (params: { staffId: number }) => ({
        url: NetWork.staffId(params.staffId),
        method: GET
      })
    }),
    addStaff: builder.mutation({
      query: (data) => ({
        url: NetWork.staff,
        method: POST,
        data: data
      })
    }),
    updateStaff: builder.mutation({
      query: (data) => ({
        url: NetWork.staffId(data.id),
        method: PUT,
        data: data
      })
    }),
    deleteStaff: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.staff,
        method: DELETE,
        data: data
        // invalidatesTags: [{ type: 'Staff', id: 'LIST' }] // Vô hiệu hóa tag 'Staff' với id 'LIST' để gọi lại getListStaff
      })
    }),
    activeStaff: builder.mutation({
      query: (data: { staffId: number; active: boolean }) => ({
        url: NetWork.staffActive(data.staffId),
        method: PATCH,
        params: { active: data.active }
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListStaffQuery,
  useDeleteStaffMutation,
  useActiveStaffMutation,
  useAddStaffMutation,
  useGetStaffByIdQuery,
  useUpdateStaffMutation
} = staffApi
