import { StatusCodes } from '../constant/statusCodes'
import { type Request, type Response } from 'express'
import notesService from '../services/notes.service'
import { NotesDTO, UpdateNotesDTO } from '../dto/notes.dto'
import { Message } from '../constant/messages'
import HttpException from '../utils/HttpException.utils'
import AppError from '../utils/HttpException.utils'
export class NotesController {
  async create(req: Request, res: Response) {
    try {
      if (req?.files?.length === 0) throw AppError.badRequest('Sorry file couldnot be uploaded')
      console.log(req?.files?.length)
      const img = req?.files?.map((file: any) => {
        return {
          name: file?.filename,
          mimiType: file?.mimetype,
          type: req.body?.type,
        }
      })

      const userId = req.user?.id
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: false,
          message: 'User not authenticated',
        })
      }
      const notesDTO: NotesDTO = req.body

      const data = await notesService.create(userId, notesDTO, img)

      res.status(StatusCodes.CREATED).json({
        status: true,
        message: Message.created,
        data,
      })
    } catch (error: any) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    }
  }

  async getOne(req: Request, res: Response) {
    const userId = req.user?.id
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: 'user not authenticated',
      })
    }
    try {
      const data = await notesService.getOne(userId)
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: Message.fetched,
        data,
      })
    } catch (error: any) {
      console.log(error)
      throw HttpException.badRequest(error.message)
    }
  }
  async getAll(req: Request, res: Response) {
    const data = await notesService.getAll()
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: Message.fetched,
      data,
    })
  }
  async update(req: Request, res: Response) {
    console.log("haha")
    const userId = req.user?.id
    const noteId = req.params.id
    // if (!userId) {
    //   return res.status(StatusCodes.UNAUTHORIZED).json({
    //     status: false,
    //     message: Message.notAuthorized,
    //   })
    // }

    const data= req?.files?.map((file?:any)=>{
      return {
        name:file?.filename,
        mimetype:file?.mimetype,
        type:req.body?.type
      }
    })
    try {
     const body = req.body
      console.log(body,"body ho la")
      const updatedNote = await notesService.update(userId!, noteId, req.body as NotesDTO,data)
            res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: Message.updated,
        data: updatedNote,
      })
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    }
  }
  async delete(req: Request, res: Response) {
    console.log('ya chai aaipugo hai')
    const userId = req.user?.id
    const noteId = req.params.id
    console.log(userId)
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: false,
        message: Message.notAuthorized,
      })
    }
    try {
      const deleteNote = await notesService.delete(userId, noteId)
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: Message.deleted,
        data: deleteNote,
      })
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    }
  }
  async getAllUserPost(req:Request,res:Response){
    const userId= req?.user?.id
    const data = await notesService.getAllUserPost(userId as string)
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: Message.fetched,
      data,
    })
  }
  async getSelectedUserPost(req:Request,res:Response){
    const userId= req?.params.id
    const data = await notesService.getAllUserPost(userId as string)
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: Message.fetched,
      data,
    })
  }
}

export default new NotesController()
