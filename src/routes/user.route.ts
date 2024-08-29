import type { Router as IRouter } from 'express'
import Router from 'express'
import { UserAuthController } from '../controller/userAuth.controller'
import { catchAsync } from '../utils/catchAsync.utils'
import upload from '../utils/fileUpload'
import { authentication } from '../middleware/authentication.middleware'
const router: IRouter = Router()

const userAuthController = new UserAuthController()
// router.post('/new-signup',upload.array('files'),catchAsync(userAuthController.))

router.post('/signup', upload.array('files'),catchAsync(userAuthController.create))

router.patch('/update/:id',upload.array('files'),catchAsync(userAuthController.update))

router.get('/', catchAsync(userAuthController.getAll))
router.get('/one/:id',userAuthController.getOne)
router.use(authentication())
router.patch('/update-media',upload.array('files'),catchAsync(userAuthController.updateProfile))

router.get('/byToken',userAuthController.getByToken)
router.delete('/:id',userAuthController.delete)
export default router