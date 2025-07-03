// Common types
export type Maybe<T> = T | null | undefined
export type Nullable<T> = T | null
export type Optional<T> = T | undefined

// Pagination
export interface PaginationParams {
  page: number
  limit: number
  orderBy?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: Record<string, unknown>
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
  timestamp: string
  path?: string
}

// Base Entity
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface SoftDeletableEntity extends BaseEntity {
  deletedAt: Date | null
}

// Useful types for functions
export type AsyncFunction<T = void> = () => Promise<T>
export type AsyncFunctionWithArgs<TArgs, TReturn = void> = (args: TArgs) => Promise<TReturn>

export {}
