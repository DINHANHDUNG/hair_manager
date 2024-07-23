// export interface Base {
//   name: string
// }

import { Icon, IconProps } from '@tabler/icons-react'
import React from 'react'

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

export interface MenuItem {
  id: string
  title?: string
  type?: string
  url?: string
  icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>
  caption?: string
  breadcrumbs?: boolean
  target?: boolean
  children?: Array<MenuItem>
  disabled?: boolean
  chip?: {
    label?: string
    avatar?: React.ReactElement
    size?: 'small' | 'medium'
    variant?: 'filled' | 'outlined'
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  }
}
