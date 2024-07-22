import { FriendDTO } from '../dto/friend.dto';
import { AppDataSource } from '../config/database.config';
import { User } from '../entities/user/user.entity';
import { Friends } from '../entities/friends.entity';
import { Message } from '../constant/messages';
import UserService from './user.service';
import{Status}from '../constant/enum'
import HttpException from '../utils/HttpException.utils';

class FriendService {
  constructor(
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly friendsRepo = AppDataSource.getRepository(Friends)
  ) {}

  async addFriend(senderUserId: any, receiverUserId: string, body: FriendDTO) {
    if (senderUserId === receiverUserId) {
      return { message: 'You cannot send a friend request to yourself.' };
    }

    // Check if a friend request has already been sent
    const alreadySent = await this.friendsRepo.findOne({
      where: {
        sender_id: senderUserId,
        receiver_id: receiverUserId,
      },
    });
    console.log(alreadySent)
    if (alreadySent) {
      return { message: 'Friend request already sent.' };
    }

    // Create a new friend request
    const addFriend = new Friends();
    addFriend.sender_id = senderUserId;
    addFriend.receiver_id = receiverUserId;
    addFriend.status = Status.PENDING;

    // Save the new friend request
    await this.friendsRepo.save(addFriend);

    return { message: Message.created };
  }

  async friendRequest(receiverUserId: string) {
    const getAllRequest = await this.friendsRepo.find({
      where: {
        receiver_id: receiverUserId,
      },
    });

    const listSenderId = getAllRequest.map((item) => item.sender_id);

    for (let i = 0; i < listSenderId.length; i++) {
      const senderDetails = await UserService.getById(listSenderId[i]);
      console.log(senderDetails);
    }
  }async accepted(friendId: string, userId: any) {
  const friendRequest = await this.friendsRepo.findOne({
    where: {
      
      receiver_id: userId,
    },
  });
  console.log(friendRequest,'checking the reuqest')

  if (!friendRequest) {
    throw  HttpException.notFound
  }

 
  friendRequest.status = Status.ACCEPTED;
  await this.friendsRepo.save(friendRequest);

  return friendRequest;
}

}

export default new FriendService() 