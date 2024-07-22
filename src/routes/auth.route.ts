import { catchAsync } from '../utils/catchAsync.utils'
import  { UserAuthController } from '../controller/userAuth.controller'
import RequestValidator from '../middleware/Request.Validator'
import express from 'express'
import { LoginDTO } from '../dto/auth.dto'

const userAuthController = new UserAuthController()


const router = express.Router()
router.post('/',RequestValidator.validate(LoginDTO),catchAsync(userAuthController.login))
export default router