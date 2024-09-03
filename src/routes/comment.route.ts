import { catchAsync } from '../utils/catchAsync.utils'
import { NotesController } from '../controller/notes.controller'
import RequestValidator from '../middleware/Request.Validator'
import { NotesDTO,UpdateNotesDTO } from '../dto/notes.dto'
import { Role } from '../constant/enum'
import express from 'express'
import { authorization } from '../middleware/authorization.middleware'
import { authentication } from '../middleware/authentication.middleware'
import { CommentController } from '../controller/comment.controller'
import { CommentDTO } from '../dto/comment.dto'
const commentController = new CommentController()


const router = express.Router()
router.use(authentication())

router.post('/:id',RequestValidator.validate(CommentDTO),catchAsync(commentController.addComment))
router.delete('/:id',catchAsync(commentController.deleteComments))
router.patch('/:id',catchAsync(commentController.updateComment))
router.get('/:id',catchAsync(commentController.getComments))
export default router