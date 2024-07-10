import { type NextFunction, type Request, type Response } from 'express'
import { type Role } from '../constant/enum'
import { Message } from '../constant/messages'
import HttpException from '../utils/HttpException.utils'

export const authorization = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!req.user) throw HttpException.unauthorized(Message.notAuthorized)
    try {
      const userRole = req.user.role
      if (userRole && roles.includes(userRole as Role)) next()
      else throw HttpException.unauthorized(Message.notAuthorized)
    } catch (err: any) {
      throw HttpException.unauthorized(Message.notAuthorized)
    }
  }
}
