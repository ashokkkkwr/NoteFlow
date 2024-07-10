import path from 'path'
import { Environment } from '../constant/enum'
export const getUploadFolderPath = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION) return path.resolve(process.cwd(), 'public', 'uploads')
  return path.join(__dirname, '..', '..', 'public', 'uploads')
}
export const getTempFolderPath = (): string => {
  return path.resolve(process.cwd(), 'public', 'uploads', 'temp')
}
