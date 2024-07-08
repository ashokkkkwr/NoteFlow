import type{Router as IRouter} from 'express'
import Router from 'express'
import { UserAuthController } from '../controller/userAuth.controller'
import { catchAsync } from '../utils/catchAsync.utils'
import RequestValidator from '../middleware/Request.Validator'
import { UserDetailsDTO } from '../dto/user.dto'
const router:IRouter = Router()

const userAuthController = new UserAuthController
router.post('/',RequestValidator.validate(UserDetailsDTO),catchAsync(userAuthController.create))
export default router