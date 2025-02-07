declare global {
  namespace Express {
    interface Response {
      sendSuccessResponse: <T>(serviceResponse: IServiceResponse<T>) => void
      sendErrorResponse: (serviceResponse: IErrorResponse) => void
    }
  }
}

export interface IErrorResponse {
  error: {
    type: string
    message: string
  }
}

export interface IServiceResponse<T> {
  data: T
  metadata?: { page: number; limit: number; total: number }
}

export interface IResponse {
  status: number
  data: object
}
