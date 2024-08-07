import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user/user.entity";
import { Message } from "../entities/message.entity";
import { Status } from "../constant/enum";
import HttpException from "../utils/HttpException.utils";

class chatService{
    private readonly userRepo=AppDataSource.getRepository(User)
    private readonly messageRepo=AppDataSource.getRepository(Message)

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const receiver = await this.userRepo.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new HttpException('User not found', 404);
    }

    const message = new Message();
    message.sender_id = senderId;
    message.receiver_id = receiverId;
    message.content = content;

    await this.messageRepo.save(message);

    return message;
  }
  async getMessages(userId: string, receiverId: string) {
    return await this.messageRepo.find({
      where: [
        {
          sender_id: userId,
          receiver_id: receiverId,
        },
        {
          sender_id: receiverId,
          receiver_id: userId,
        },
      ],
      relations: [
        'sender',
        'receiver',
        'sender.details',
        'sender.details.profileImage',
        'receiver.details',
        'receiver.details.profileImage',
      ],
      
    });
  }
  async read(chatId:string){
    const message= await this.messageRepo.findOne({
      where:[
        {
          id:chatId
        }
      ]

    })
    if(!message){
      throw new Error(`Not found`)
    }
    message.read=true
    await this.messageRepo.save(message);
  }
  
  
}
export default new chatService()