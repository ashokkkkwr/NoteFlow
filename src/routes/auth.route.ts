import { catchAsync } from '../utils/catchAsync.utils'
import  { UserAuthController } from '../controller/userAuth.controller'
import RequestValidator from '../middleware/Request.Validator'
import express from 'express'
import { LoginDTO } from '../dto/auth.dto'
import { authentication } from '../middleware/authentication.middleware'

const userAuthController = new UserAuthController()


const router = express.Router()
router.post('/verify-email', catchAsync(UserAuthController.verifyEmail))
router.post('/',catchAsync(userAuthController.login))
router.use(authentication())
router.patch('/',catchAsync(userAuthController.updatePassword))
export default router