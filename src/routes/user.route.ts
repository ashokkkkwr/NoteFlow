import type{Router as IRouter} from 'express'
import Router from 'express'
import { UserAuthController } from '../controller/userAuth.controller'
import { catchAsync } from '../utils/catchAsync.utils'
import RequestValidator from '../middleware/Request.Validator'
import { UserDTO } from '../dto/user.dto'


const router:IRouter = Router()


const userAuthController = new UserAuthController
router.post('/',RequestValidator.validate(UserDTO),catchAsync(userAuthController.create))
router.get('/',userAuthController.getAll)
export default router