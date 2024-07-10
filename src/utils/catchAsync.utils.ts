import { type NextFunction, type Request, type RequestHandler, type Response } from 'express'
export const catchAsync =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await Promise.resolve(fn(req, res, next)).catch(next)
  }


  