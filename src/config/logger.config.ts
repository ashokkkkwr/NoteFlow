import winston from 'winston'
import { Environment } from '../constant/enum'
import { DotenvConfig } from './env.config'
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}
const level = () => {
  const env = DotenvConfig.NODE_ENV ?? Environment.DEVELOPMENT
  const isDevelopment = env === Environment.DEVELOPMENT
  return isDevelopment ? 'debug' : 'warn'
}
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'megenta',
  debug: 'white',
}
winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamps}${info.level}:${info.message}`)
)

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'log/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'log/all.log' }),
]
export const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})
