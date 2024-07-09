import type{Router as IRouter} from 'express'
import Router from 'express'
import { UserAuthController } from '../controller/userAuth.controller'
import { catchAsync } from '../utils/catchAsync.utils'
import RequestValidator from '../middleware/Request.Validator'
import { UserDTO } from '../dto/user.dto'
import { LoginDTO } from '../dto/auth.dto'


const router:IRouter = Router()


const userAuthController = new UserAuthController
router.post('/',RequestValidator.validate(UserDTO),catchAsync(userAuthController.create))
router.get('/',userAuthController.getAll)
router.post('/login',RequestValidator.validate(LoginDTO),catchAsync(userAuthController.login))
export default router