import { createApi } from '@reduxjs/toolkit/query/react'
import { NetWork } from '../../../common/apiKey'
import { DELETE, GET, POST, PUT } from '../../../common/contants'
import { ReponseData2 } from '../../../types'
import { EmployeeType } from '../../../types/employee'
import { axiosBaseQuery } from '../../baseQuery'

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    getListEmployee: builder.query({
      query: (params) => ({
        url: NetWork.employee,
        method: GET,
        params: params,
        providesTags: (result: ReponseData2<{ rows: EmployeeType[] }>) =>
          result ? [{ type: 'Employee', id: 'LIST' }] : []
      })
    }),
    getEmployeeById: builder.query({
      query: (params: { employeeId: number }) => ({
        url: NetWork.employeeId(params.employeeId),
        method: GET
      })
    }),
    addEmployee: builder.mutation({
      query: (data) => ({
        url: NetWork.employee,
        method: POST,
        data: data
      })
    }),
    updateEmployee: builder.mutation({
      query: (data) => ({
        url: NetWork.employeeId(data.id),
        method: PUT,
        data: data
      })
    }),
    deleteEmployee: builder.mutation({
      query: (data: { ids: Array<number> }) => ({
        url: NetWork.employee,
        method: DELETE,
        data: data
        // invalidatesTags: [{ type: 'Employee', id: 'LIST' }] // Vô hiệu hóa tag 'Employee' với id 'LIST' để gọi lại getListEmployee
      })
    })
  })
})

// Export hooks for usage in functional components
export const {
  useGetListEmployeeQuery,
  useDeleteEmployeeMutation,
  useAddEmployeeMutation,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation
} = employeeApi
