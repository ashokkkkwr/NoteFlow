import { catchAsync } from '../utils/catchAsync.utils'
import RequestValidator from '../middleware/Request.Validator'
import express from 'express'
import { authorization } from '../middleware/authorization.middleware'
import { authentication } from '../middleware/authentication.middleware'
import { CommentController } from '../controller/comment.controller'
import likeController from '../controller/like.controller' 
const commentController = new CommentController()


const router = express.Router()
router.use(authentication())
router.post('/like/:id',catchAsync(likeController.like))
export default router