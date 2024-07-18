// export interface Base {
//   name: string
// }

// export type EditBase = Base & { id: number }

export interface Paginate {
  currentPage: number
  lastPage: number
}

export interface PaginateResponse {
  current_page: number
  page_size: number
  total: number
}

export interface ReponseData<T> extends Partial<PaginateResponse> {
  code: number
  error: boolean
  message: string
  data: T
}

export interface ReponseData<T> {
  code: number
  error: boolean
  message: string
  data: T
}

export interface RejectValue {
  error: string
  code: number
}
