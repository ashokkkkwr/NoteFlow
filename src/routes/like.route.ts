import { catchAsync } from '../utils/catchAsync.utils'
import RequestValidator from '../middleware/Request.Validator'
import express from 'express'
import { authorization } from '../middleware/authorization.middleware'
import { authentication } from '../middleware/authentication.middleware'
import likeController from '../controller/like.controller' 
const router = express.Router()
router.use(authentication())
router.post('/like/:id',catchAsync(likeController.like))
router.get('/like/:id',catchAsync(likeController.likeCount))
router.get('/user-like',catchAsync(likeController.userLike))
router.get('/post-like/:id',catchAsync(likeController.postLike))
export default router