import { catchAsync } from '../utils/catchAsync.utils'
import  {ChatController}  from '../controller/chat.controller'
import RequestValidator from '../middleware/Request.Validator'
import express from 'express'
import { LoginDTO } from '../dto/auth.dto'

const chatController = new ChatController()


const router = express.Router()
router.post('/',catchAsync(chatController.sendMessage))
export default router