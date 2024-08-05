import { catchAsync } from '../utils/catchAsync.utils'
import  {ChatController}  from '../controller/chat.controller'
import RequestValidator from '../middleware/Request.Validator'
import express from 'express'
import { authentication } from '../middleware/authentication.middleware'

import { LoginDTO } from '../dto/auth.dto'

const chatController = new ChatController()



const router = express.Router()




router.use(authentication())
router.post('/',catchAsync(chatController.sendMessage))
router.get('/',catchAsync(chatController.getMessages))
export default router
