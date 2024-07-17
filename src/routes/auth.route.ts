import { catchAsync } from '../utils/catchAsync.utils'
import  { UserAuthController } from '../controller/userAuth.controller'
import RequestValidator from '../middleware/Request.Validator'
import { NotesDTO,UpdateNotesDTO } from '../dto/notes.dto'
import { Role } from '../constant/enum'
import express from 'express'
import { authorization } from '../middleware/authorization.middleware'
import { authentication } from '../middleware/authentication.middleware'
import { LoginDTO,VerifyEmailDTO } from '../dto/auth.dto'

const userAuthController = new UserAuthController()


const router = express.Router()
router.post('/',RequestValidator.validate(LoginDTO),catchAsync(userAuthController.login))
router.post('/verify-email',RequestValidator.validate(VerifyEmailDTO),catchAsync(userAuthController.verifyEmail))
export default router