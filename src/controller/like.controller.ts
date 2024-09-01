import {type Request,type Response} from 'express';
import { StatusCodes } from '../constant/statusCodes';
import { Message } from '../constant/messages';

export class LikeController{
    async like(req:Request,res:Response){
        try{
            const userId = req?.user?.id;
            const postId = req?.params?.postId;
            const likes= await 
            res.status(StatusCodes.SUCCESS).json({
                data:this.likes,
                message:Message.created,
            })
        }catch(){
            res.status(StatusCodes.BAD_REQUEST).json({
                message:Message.error,
            })
        }
    }
    async likeCount(req:Request, res:Response){
        const userId= req?.user?.id;
        const postId= req?.params?.postId;
        const likes= await
        res.status(StatusCodes.SUCCESS).json({
            data:likes,
            message:Message.fetched
        })
    }
}