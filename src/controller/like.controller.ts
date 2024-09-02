import {type Request,type Response} from 'express';
import { StatusCodes } from '../constant/statusCodes';
import { Message } from '../constant/messages';
import likeService from '../services/like.service';
 class LikeController{
    async like(req:Request,res:Response){
        try{
            const userId = req?.user?.id;
            console.log("🚀 ~ LikeController ~ like ~ userId:", userId)
            const postId = req?.params?.id;
            console.log("🚀 ~ LikeController ~ like ~ postId:", postId)
            const likes= await likeService.changeLike(userId as string,postId)
            res.status(StatusCodes.SUCCESS).json({
                data:likes,
                message:Message.created,
            })
        }catch(error){
            res.status(StatusCodes.BAD_REQUEST).json({
                message:Message.error,
            })
        }
    }
    async likeCount(req:Request, res:Response){
        const userId= req?.user?.id;
        const postId= req?.params?.postId;
        const likes= await likeService.getLikeCount(postId)
        res.status(StatusCodes.SUCCESS).json({
            data:likes,
            message:Message.fetched
        })
    }
    async userLike(req:Request,res:Response){
        try{
            
            const userId=req?.user?.id
            console.log("🚀 ~ LikeController ~ userLike ~ userId:", userId)
            const likes = await likeService.getUserLikes(userId as string)
            res.status(StatusCodes.SUCCESS).json({
               data: likes,
                Message:Message.fetched
            })
        }catch(error){
            res.status(StatusCodes.BAD_REQUEST).json({
                message:Message.error
            })
        }
    }
    async postLike(req:Request,res:Response){
        const userId=req?.user?.id
        console.log("🚀 ~ LikeController ~ postLike ~ userId:", userId)
        const postId= req?.params.id
        const likes = await likeService.postLike(userId as string,postId)
        res.status(StatusCodes.SUCCESS).json({
            data: likes,
            Message:Message.fetched
        })
    }
}
export default new LikeController