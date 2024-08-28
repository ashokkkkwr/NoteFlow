import { AppDataSource } from "../config/database.config";
import { User } from "../entities/user/user.entity";
import { Message } from "../entities/message.entity";
import HttpException from "../utils/HttpException.utils";
import { Room } from "../entities/room.entity";
import { In } from 'typeorm';
import { EncryptionService } from "../utils/EncryptionService";

class ChatService {
  private readonly userRepo = AppDataSource.getRepository(User);
  private readonly messageRepo = AppDataSource.getRepository(Message);
  private readonly roomRepo = AppDataSource.getRepository(Room);

  async sendMessage(senderId: string, receiverId: string, content: string, roomId: string) {
    const room = await this.roomRepo.findOneBy({ id: roomId });
    console.log(room, "This is the room id...");

    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    const receiver = await this.userRepo.findOne({ where: { id: receiverId } });

    if (!room) {
      throw new HttpException("Room not found", 404);
    }

    if (!sender || !receiver) {
      throw new HttpException('User not found', 404);
    }

    const encryptedMessage = EncryptionService.encryptMessage(content);

    const message = new Message();
    message.sender_id = senderId;
    message.receiver_id = receiverId;
    message.content = encryptedMessage;
    message.room = room;

    const savedMessage = await this.messageRepo.save(message);

    // Decrypt the message before returning
    const decryptedContent = EncryptionService.decryptMessage(savedMessage.content);
    savedMessage.content = decryptedContent;

    return savedMessage;
  }

  async getMessages(userId: string, receiverId: string) {
    try {
      const chats = await this.messageRepo.find({
        where: [
          { sender_id: userId, receiver_id: receiverId },
          { sender_id: receiverId, receiver_id: userId },
        ],
        relations: ['sender', 'receiver', 'sender.details', 'sender.details.profileImage', 'receiver.details', 'receiver.details.profileImage'],
        order: {
          createdAt: 'ASC'
        }
      });

      const decryptedChats = chats.map(chat => {
        try {
          const decryptedMessage = EncryptionService.decryptMessage(chat.content);
          return { ...chat, content: decryptedMessage };
        } catch (error) {
          console.error(`Failed to decrypt message with ID ${chat.id}:`, error);
          throw new HttpException('Failed to decrypt message', 403);
        }
      });

      return decryptedChats;
    } catch (error) {
      console.log("Error in getMessages:", error);
      throw new HttpException('Could not retrieve messages', 500);
    }
  }

  // async readMessages(receiverId:string,senderId:string){
  //   const messages = await this.messageRepo.update({
  //     sender:{id:senderId},
  //     receiver:{id:receiverId},
  //     read:false
  //   },
  //  {read:true} 
  // )
  // return messages
  // }

  async readMessages(receiverId:string,senderId:string) {
    const messages = await this.messageRepo.findBy({sender_id:senderId,receiver_id:receiverId  });
    messages.forEach(message => {
      message.read = true;
    });
    return await this.messageRepo.save(messages);
  }
  async getUnreadCounts(senderId: string, receiverId: string) {
    const unreadCount = await this.messageRepo.count({
      where: {
        sender_id: receiverId,
        receiver_id: senderId,
        read: false,
      }
    });
    return unreadCount;
  }

    
}

export default new ChatService();
