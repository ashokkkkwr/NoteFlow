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
    try{
      console.log(receiverUserId)
      const view = await this.friendsRepo.createQueryBuilder('friends')
      .leftJoinAndSelect('friends.sender','sender')
      .leftJoinAndSelect('sender.details','details')
      .leftJoinAndSelect('details.profileImage','profileImage')
      .where('friends.receiver_id=:receiverUserId',{receiverUserId})
      .andWhere('friends.status=:status',{status:Status.PENDING})

      .getMany()
      console.log(view)
      return view
    }catch(error){
      throw HttpException.notFound
    }
  }
 
  async viewUser(loggedInUserId: any) {
    try {
      const users = await this.userRepo.createQueryBuilder('user')
        .leftJoinAndSelect('user.details', 'details')
        .leftJoinAndSelect('details.profileImage', 'profileImage')
        .where('user.id != :loggedInUserId', { loggedInUserId })
        .andWhere(qb => {
          const subQuery = qb.subQuery()
            .select('friends.sender_id')
            .from(Friends, 'friends')
            .where('friends.receiver_id = :loggedInUserId', { loggedInUserId })
            .andWhere('(friends.status = :statusPending OR friends.status = :statusAccepted)', { statusPending: Status.PENDING, statusAccepted: Status.ACCEPTED })
            .getQuery();
          return 'user.id NOT IN ' + subQuery;
        })
        .andWhere(qb => {
          const subQuery = qb.subQuery()
            .select('friends.receiver_id')
            .from(Friends, 'friends')
            .where('friends.sender_id = :loggedInUserId', { loggedInUserId })
            .andWhere('(friends.status = :statusPending OR friends.status = :statusAccepted)', { statusPending: Status.PENDING, statusAccepted: Status.ACCEPTED })
            .getQuery();
          return 'user.id NOT IN ' + subQuery;
        })
        .getMany();

      return users;
    } catch (error: any) {
      throw HttpException.badRequest(error.message);
    }
  }
  async accepted(friendId: string, userId: any) {
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