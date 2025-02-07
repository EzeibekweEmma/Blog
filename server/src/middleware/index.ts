import { IErrorResponse, IServiceResponse } from '@/interface'
import { Request, Response, NextFunction } from 'express'

const ERROR_STATUS_CODES: { [key: string]: number } = {
  NotFound: 404,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  InternalServerError: 500,
}

export function handleSuccessResponse(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  function sendSuccessResponse<T>(
    serviceResponse: IServiceResponse<T>
  ): Response {
    const { data, metadata } = serviceResponse
    const code = req.method === 'POST' ? 201 : 200
    const responseData = metadata ? { data, metadata } : { data }

    return res.status(code).json(responseData)
  }

  res.sendSuccessResponse = sendSuccessResponse
  next()
}

export function handleErrorResponse(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  function sendErrorResponse(errorResponse: IErrorResponse): Response {
    const code = ERROR_STATUS_CODES[errorResponse.error.type] || 500
    return res.status(code).json(errorResponse)
  }

  res.sendErrorResponse = sendErrorResponse
  next()
}
