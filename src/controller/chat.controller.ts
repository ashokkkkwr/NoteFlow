import {Request,Response} from 'express'
import chatService from '../services/chat.service'
import { StatusCodes } from '../constant/statusCodes'
import { Message } from '../constant/messages'


export class ChatController{
    async sendMessage(req:Request,res:Response){

        const senderId = req.user?.id
        console.log(senderId)
        const{receiverId,content}=req.body;
        try{
            const message = await chatService.sendMessage(senderId as string,receiverId,content)
            console.log(message)
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                stats:true,
                message:Message.created,
                data:message
            })

            
        }catch(error:any){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                status:false,
                message:error.message
            })
        }
    }
    async getMessages(req:Request,res:Response){
        const userId=req.user?.id;
        const receiverId=req.params.id
        try {
            const messages = await chatService.getMessages(userId as string, receiverId);
            res.status(StatusCodes.SUCCESS).json({
              status: true,
              message: 'Messages fetched',
              data: messages,
            });
          } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              status: false,
              message: error.message,
            });
          }
        }
        async markAsRead(req:Request,res:Response){
          const chatId=req.params.id
          try{
            const read= await chatService.read(chatId);
            res.status(StatusCodes.SUCCESS).json({
              status:true,
              message:'Message Updated',
              data:read
            })
          }catch(error:any){
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              status:false,
              message:error.message
            })
          }
        }
    }
