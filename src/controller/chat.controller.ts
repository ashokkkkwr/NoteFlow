import {Request,Response} from 'express'
import chatService from '../services/chat.service'
import { StatusCodes } from '../constant/statusCodes'
import { Message } from '../constant/messages'


export class ChatController{
    async sendMessage(req:Request,res:Response){

        const senderId = req.user?.id
        const{receiverId,content}=req.body;
        try{
            const message = await chatService.sendMessage(senderId as string,receiverId,content)
        }catch(error:any){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status:false,
                message:error.message
            })
        }
    }
}