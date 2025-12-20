export interface ApiResponse<T = any> {
  statusCode: number
  status: string
  data: T
  message: string
}

export interface ApiError {
  statusCode: number
  message: string | string[]
  error?: string
}

