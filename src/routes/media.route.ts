import {Router} from 'express'
import { catchAsync } from '../utils/catchAsync.utils'
import uploadFile from '../utils/fileUpload'
import mediaController from '../controller/media.controller'

const router = Router()

router.post('/',uploadFile.array('file'),catchAsync(mediaController.create))
export default router