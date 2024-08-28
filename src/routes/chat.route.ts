import { catchAsync } from '../utils/catchAsync.utils'
import  {ChatController}  from '../controller/chat.controller'
import RequestValidator from '../middleware/Request.Validator'
import express from 'express'
import { authentication } from '../middleware/authentication.middleware'

const chatController = new ChatController()



const router = express.Router()




router.use(authentication())
router.post('/',catchAsync(chatController.sendMessage))
router.get('/:id',catchAsync(chatController.getMessages))
router.get('/counts/:id',catchAsync(chatController.getUnreadCounts))
// router.patch('/markAsRead/:id',catchAsync(chatController.markAsRead))
export default router
