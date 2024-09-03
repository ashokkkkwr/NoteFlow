import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
export class DotenvConfig {
  static NODE_ENV = process.env.NODE_ENV
  static PORT = +process.env.PORT!

  // frontend
  static FRONTEND_URL = process.env.FRONTEND_URL
  // *Database Configurations
  static DATABASE_HOST = process.env.DATABASE_HOST
  static DATABASE_PORT = +process.env.DATABASE_PORT!
  static DATABASE_USERNAME = process.env.DATABASE_USERNAME
  static DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
  static DATABASE_NAME = process.env.DATABASE_NAME
 // *Other Configurations
  static DEBUG_MODE = process.env.DEBUG_MODE

  // JWT configuration
  static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
  static ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN!
  static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!
  static REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN!
  static FORGOT_PASSWORD_SECRET = process.env.FORGOT_PASSWORD_SECRET!
  static FORGOT_PASSWORD_EXPIRES_IN = process.env.FORGOT_PASSWORD_EXPIRES_IN!

  // *Server Information
  static BASE_URL = process.env.BASE_URL!
  static FOLDER = process.env.FOLDER!
  static TEMP_FOLDER = process.env.TEMP_FOLDER!

  //* Email Information
  static MAIL_HOST = process.env.MAIL_HOST
  static MAIL_AUTH = process.env.MAIL_AUTH
  static MAIL_PASSWORD = process.env.MAIL_PASSWORD
  static MAIL_PORT = process.env.MAIL_PORT
  static MAIL_USERNAME = process.env.MAIL_USERNAME
  static MAIL_FROM = process.env.MAIL_FROM

  // *Trash
  static PERMANENT_DELETE_AFTER_DAYS = process.env.PERMANENT_DELETE_AFTER_DAYS!

  // *Media
  static MEDIA_FOLDER = process.env.MEDIA_FOLDER!

  // *Default Per Page
  static DEFAULT_PER_PAGE = +process.env.DEFAULT_PER_PAGE!
  static OTP_SECRET = process.env.OTP_SECRET!

  // *Cors origin list
  static CORS_ORIGIN = process.env.CORS_ORIGIN?.split(', ') || []

  // *API key for testing in postman or other tools
  static API_KEY = process.env.API_KEY
}
