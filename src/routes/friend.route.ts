import express from 'express'
import { catchAsync } from '../utils/catchAsync.utils'
import {friendController} from '../controller/friend.controller'
import {authentication} from '../middleware/authentication.middleware'
import { authorization } from '../middleware/authorization.middleware'
import { Role } from '../constant/enum'
const FriendController = new friendController()

const router = express.Router()
router.use(authentication())
router.use(authorization([Role.USER]))

router.post('/:id',catchAsync(FriendController.addFriend))
router.get('/',catchAsync(FriendController.viewFriendRequest))
router.get('/friends',catchAsync(FriendController.viewFriends))
router.delete('/:id',catchAsync(FriendController.deleteRequest))

router.patch('/accept-request/:id',catchAsync(FriendController.acceptRequest))
router.get('/view-user',catchAsync(FriendController.viewUser))

export default router