import { Request, Response } from 'express'
import { getServerStatusService } from '@/services'

export async function getServerStatusController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = getServerStatusService()
    res.sendSuccessResponse(result)
  } catch (error) {
    res.sendErrorResponse({
      error: {
        type: 'InternalServerError',
        message: (error as Error).message,
      },
    })
  }
}
