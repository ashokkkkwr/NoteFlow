import { StatusCodes } from "../constant/statusCodes";
import HttpException from "../utils/HttpException.utils";
import {response, type Request, type Response} from 'express'
import {Message} from '../constant/messages'
import commentService from "../services/comment.service";
import { CommentDTO } from "../dto/comment.dto";
export class CommentController {
    // try {
    //     const data=await notesService.create(userId, notesDTO)
    //     console.log(data,'dataa')
    //     res.status(StatusCodes.CREATED).json({
    //       status: true,
    //       message: Message.created,
    //       data,
    //     })
    //   } catch (error: any) {
    //     res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    //       status: false,
    //       message: error.message,
    //     })
    //   }
    async addComment(req:Request,res:Response)
    {
        try{
        const postId = req.params.id
        console.log(postId)
        const data = await commentService.create(postId as string, req.body)
        res.status(StatusCodes.CREATED).json({
            status:true,
            message:Message.created,
            data
        })
      
        }catch(error:any){
            res.status(error.status||StatusCodes.INTERNAL_SERVER_ERROR).json({
                status:false,
                message:error.message
            })
        }
    }
    async deleteComments()
    {

    }
    async updateComment()
    {

    }
    async readComment()
    {

    }

}
