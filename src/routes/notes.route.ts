import { catchAsync } from '../utils/catchAsync.utils'
import { NotesController } from '../controller/notes.controller'
import RequestValidator from '../middleware/Request.Validator'
import { NotesDTO,UpdateNotesDTO } from '../dto/notes.dto'
import { Role } from '../constant/enum'
import express from 'express'
import { authorization } from '../middleware/authorization.middleware'
import { authentication } from '../middleware/authentication.middleware'
import upload from '../utils/fileUpload'
const router = express.Router()

const notesController = new NotesController()


router.get('/all', catchAsync(notesController.getAll))
router.use(authentication())
router.use(authorization([Role.USER]))

router.post('/',  upload.array('files'),catchAsync(notesController.create))

router.get('/', catchAsync(notesController.getOne))
router.patch('/:id', RequestValidator.validate(UpdateNotesDTO), catchAsync(notesController.update))
router.delete('/:id',catchAsync(notesController.delete))

export default router

