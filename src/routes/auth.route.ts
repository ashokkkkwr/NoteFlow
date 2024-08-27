import { catchAsync } from '../utils/catchAsync.utils'
import  { UserAuthController } from '../controller/userAuth.controller'
import RequestValidator from '../middleware/Request.Validator'
import express from 'express'
import { LoginDTO } from '../dto/auth.dto'
import { authentication } from '../middleware/authentication.middleware'

const userAuthController = new UserAuthController()


const router = express.Router()
router.post('/verify-email', catchAsync(userAuthController.verifyEmail))
router.post('/verify-otp', catchAsync(userAuthController.verifyOtp))
router.post('/',catchAsync(userAuthController.login))
router.post('/reset-password',catchAsync(userAuthController.resetPassword))
router.use(authentication())
router.patch('/',catchAsync(userAuthController.updatePassword))
export default router
