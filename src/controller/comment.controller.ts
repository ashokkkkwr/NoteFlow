import { StatusCodes } from "../constant/statusCodes";
import HttpException from "../utils/HttpException.utils";
import { type Request, type Response} from 'express'
import {Message} from '../constant/messages'
import commentService from "../services/comment.service";
import { CommentDTO } from "../dto/comment.dto";
export class CommentController {
 
    async addComment(req:Request,res:Response)
    {
        try{
        const postId = req.params.id
        const userId= req?.user?.id
        console.log("🚀 ~ CommentController ~ userId:", userId)
        console.log(postId)
        const data = await commentService.create(userId as string,postId as string, req.body as CommentDTO)
        res.status(StatusCodes.CREATED).json({
            status:true,
            message:Message.created,
            data
        })

        }catch(error:any){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status:false,
                message:error.message
            })
        }
    }
    async updateComment(req:Request,res:Response)
    {
        try{
             
            const commentId= req.params.id
            const data = await commentService.update(commentId as string,req.body as CommentDTO)
            res.status(StatusCodes.CREATED).json({
                status:true,
                message:Message.updated,
                data
            })

        }catch(err:any){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status:false,
                message:err.message
            })
        }
    }
    async getComments(req:Request, res:Response){
        try{
            const postId = req.params.id;
            const comments = await commentService.getComment(postId);
            res.status(StatusCodes.SUCCESS).json({
                status:true,
                message:Message.fetched,
                data:comments
            })
        }catch(error:any){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status:false,
                message:error.message,
            })
        }
   

    }
    async deleteComments(req:Request, res:Response)
    {
        try{
            const commentId = req.params.id;
            const deletedComment = await commentService.getComment(commentId);
            res.status(StatusCodes.SUCCESS).json({
                status:true,
                message:Message.fetched,
                data:deletedComment
            })
        }catch(error:any){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status:false,
                message:error.message,
            })
        }
    }
    

}
