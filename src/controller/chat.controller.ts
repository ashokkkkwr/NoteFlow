import { Request, Response } from 'express';
import chatService from '../services/chat.service';
import { StatusCodes } from '../constant/statusCodes';
import { Message } from '../constant/messages';
import RoomService from '../services/room.service';

export class ChatController {
  async sendMessage(req: Request, res: Response) {
    const senderId = req.user?.id;
    const { receiverId, content } = req.body;
    try {
      // Create or find the chat room
      const roomService = new RoomService();
      const room = await roomService.findOrCreateIfNotExist([senderId as string, receiverId]);

      // Send the message
      const message = await chatService.sendMessage(senderId as string, receiverId, content, room.id);
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: Message.created,
        data: message,
      });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      });
    }
  }

  async getMessages(req: Request, res: Response) {
    const userId = req.user?.id;
    const receiverId = req.params.id;
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
  async getUnreadCounts(req:Request,res:Response){
    const userId = req.user?.id;
    const receiverId=req.params.id;
    try{
      const readCounts = await chatService.getUnreadCounts(userId as string,receiverId)
      res.status(StatusCodes.SUCCESS).json({
        status:true,
        data:readCounts
      })
    }catch(error){
    console.log("🚀 ~ ChatController ~ getUnreadCounts ~ error:", error)

    }
  }

}
