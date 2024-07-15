import { catchAsync } from '../utils/catchAsync.utils'
import { NotesController } from '../controller/notes.controller'
import RequestValidator from '../middleware/Request.Validator'
import { NotesDTO,UpdateNotesDTO } from '../dto/notes.dto'
import { Role } from '../constant/enum'
import express from 'express'
import { authorization } from '../middleware/authorization.middleware'
import { authentication } from '../middleware/authentication.middleware'
import { CommentController } from '../controller/comment.controller'

const commentController = new CommentController()


const router = express.Router()

 
router.post('/:id',catchAsync(commentController.addComment))


export default router

