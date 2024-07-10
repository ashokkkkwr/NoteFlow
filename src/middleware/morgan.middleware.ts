import morgan, { type StreamOptions } from 'morgan'
import { DotenvConfig } from '../config/env.config'
import { Logger } from '../config/logger.config'
import { Environment } from '../constant/enum'

const stream: StreamOptions = {
  write: (message: string) => Logger.http(message),
}
const skip = (): boolean => {
  const env = DotenvConfig.NODE_ENV ?? Environment.DEVELOPMENT
  return env !== Environment.DEVELOPMENT
}
export const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream,
  skip,
})


