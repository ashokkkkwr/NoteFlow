import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user/user.entity";
import { Message } from "../entities/message.entity";
import HttpException from "../utils/HttpException.utils";
import { Room } from "../entities/room.entity";
import { In } from 'typeorm';
class ChatService {
  private readonly userRepo = AppDataSource.getRepository(User);
  private readonly messageRepo = AppDataSource.getRepository(Message);
  private readonly roomRepo = AppDataSource.getRepository(Room)

  async sendMessage(senderId: string, receiverId: string, content: string, roomId: string) {
    const roomid = await this.roomRepo.findOneBy({ id: roomId })
    console.log(roomid, "yo chai room id ho la...")

    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const receiver = await this.userRepo.findOne({ where: { id: receiverId } });

    if (!roomid) {
      throw new HttpException(`Room not found`, 404)
    }

    if (!sender || !receiver) {
      throw new HttpException('User not found', 404);
    }

    const message = new Message();
    message.sender_id = senderId;
    message.receiver_id = receiverId;
    message.content = content;
    message.room = roomid;

    const m = await this.messageRepo.save(message);
    // Save the message with properties directly
    // const savedMessage = await this.messageRepo.save({
    //   sender_id: senderId,
    //   receiver_id: receiverId,
    //   content,
    //   room_id: roomId,
    // });
    console.log(m, message, "kjhdfsfshjgfsadgfyureftg")
    return message;
  }
  async getMessages(userId: string, receiverId: string) {
    return await this.messageRepo.find({
      where: [
        { sender_id: userId, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: userId },
      ],
      relations: ['sender', 'receiver', 'sender.details', 'sender.details.profileImage', 'receiver.details', 'receiver.details.profileImage'],
      order: {
        createdAt: 'ASC'
      }

    });
  }
 

  async readMessages(chatIds: string[]) {
      // Find all messages with the given chat IDs using the In operator
      const messages = await this.messageRepo.findBy({ id: In(chatIds) });
  
      if (messages.length !== chatIds.length) {
          throw new Error('One or more messages not found');
      }
  
      // Mark all found messages as read
      messages.forEach(message => {
          message.read = true;
      });
  
      // Save all updated messages in bulk
      await this.messageRepo.save(messages);
  }
  
}


export default new ChatService();
