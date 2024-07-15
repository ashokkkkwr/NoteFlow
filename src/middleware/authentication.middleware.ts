import { type NextFunction, type Request, type Response } from 'express'
import { DotenvConfig } from '../config/env.config'
import { Message } from '../constant/messages'
import HttpException from '../utils/HttpException.utils'
import webTokenService from '../utils/webToken.service'

export const authentication = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    /**
     * extracts the authorization header from the request and split it by spaces.
     * The result is an array('tokens') where the first element should be token
     * type(eg:Bearer) and the second element should be the actual token.
     */
    const tokens = req.headers.authorization?.split(' ')
    try {
      if (!tokens) {
        throw HttpException.unauthorized(Message.notAuthorized)
      }
      
      const mode = tokens[0]
      const accessToken = tokens[1]
      if (mode !== 'Bearer' || !accessToken) throw HttpException.unauthorized(Message.notAuthorized)
      const payload = webTokenService.verify(accessToken, DotenvConfig.ACCESS_TOKEN_SECRET)
      if (payload) {
        req.user = payload
    
        next()
      } else {
        throw HttpException.unauthorized(Message.notAuthorized)
      }
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        next(HttpException.unauthorized(Message.tokenExpired))
        return
      }
      next(HttpException.unauthorized(Message.notAuthorized))
    }
  }
}
