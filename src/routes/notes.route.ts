import { catchAsync } from "../utils/catchAsync.utils";
import {NotesController} from "../controller/notes.controller";
import { UserAuthController } from "../controller/userAuth.controller";
import RequestValidator from "../middleware/Request.Validator";
import { NotesDTO } from "../dto/notes.dto";
import express from 'express'
import { authentication } from "../middleware/authentication.middleware";
const router = express.Router()

const notesController = new NotesController()
router.get('/all',catchAsync(notesController.getAll))
router.use(authentication())
router.post('/',RequestValidator.validate(NotesDTO),catchAsync(notesController.create))
router.get('/',catchAsync(notesController.getOne))


export default router