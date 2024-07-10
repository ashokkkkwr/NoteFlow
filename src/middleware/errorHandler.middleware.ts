import { type NextFunction, type Request, type Response } from 'express'
import { DotenvConfig } from '../config/env.config'
import { Message } from '../constant/messages'
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500
  let data = {
    success: false,
    message: Message.error,
    ...(DotenvConfig.DEBUG_MODE === 'true' && { originalError: error.message }),
  }
  if (error?.isOperational || error?.isCustom) {
    statusCode = error.statusCode
    data = {
      ...data,
      message: error.message,
    }
  }
  return res.status(statusCode).json(data)
}
