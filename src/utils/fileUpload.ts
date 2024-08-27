import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { DotenvConfig } from '../config/env.config'
import { Environment, MediaType } from '../constant/enum'
import Error from './HttpException.utils'

const storage = multer.diskStorage({
  destination: function (req: any, _file: any, cb: any) {
    let folderPath = ''
    console.log(req.body.type,"ashook aksfhsf")
    if (!req.body.type) {
      return cb(Error.badRequest('Choose a File type'), '')
    }
    if (!MediaType[req.body.type as keyof typeof MediaType]) {
      return cb(Error.badRequest('Invalid file type'), '')
    }
    if (DotenvConfig.NODE_ENV === Environment.DEVELOPMENT) {
      /**
       * path.join le relative path use garxa vane
       * path.resolve le absolute path use garxa
       */
      folderPath = path.join(process.cwd(), 'public', 'uploads', 'temp')
    } else {
      folderPath = path.resolve(process.cwd(), 'public', 'uploads', 'temp')
    }
    /** the below code isa concise way to check if a director exists at the
     * specified folderpath and if it does not exist, create it.
     */
    !fs.existsSync(folderPath) && fs.mkdirSync(folderPath, { recursive: true })
    /**
     * it is used in call back function to signal that an operation has been
     *  completed successfully and to provide the result of that operation
     */
    cb(null, folderPath)
  },
  filename: (_req, file, cb) => {
    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'))
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1e9)   + extension
    cb(null, fileName)
  },
})
const upload = multer({
  storage,
})
export default upload
