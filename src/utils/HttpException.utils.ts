import { StatusCodes } from '../constant/statusCodes'

class HttpException extends Error {
  statusCode: number
  isCustom: boolean
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isCustom = true
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message: string): HttpException {
    return new HttpException(message, StatusCodes.BAD_REQUEST)
  }

  static unauthorized(message: string): HttpException {
    return new HttpException(message, StatusCodes.UNAUTHORIZED)
  }

  static notFound(message: string): HttpException {
    return new HttpException(message, StatusCodes.NOT_FOUND)
  }

  static conflict(message: string): HttpException {
    return new HttpException(message, StatusCodes.CONFLICT)
  }

  static forbidden(message: string): HttpException {
    return new HttpException(message, StatusCodes.FORBIDDEN)
  }

  static internalServerError(message: string): HttpException {
    return new HttpException(message, StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

export default HttpException
