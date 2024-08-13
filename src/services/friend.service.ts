import { FriendDTO } from '../dto/friend.dto';
import { AppDataSource } from '../config/database.config';
import { User } from '../entities/user/user.entity';
import { Friends } from '../entities/friends.entity';
import { Message } from '../constant/messages';
import UserService from './user.service';
import { Status } from '../constant/enum'
import { FriendsNotification } from '../entities/friendsNotification.entity';
import HttpException from '../utils/HttpException.utils';

class FriendService {
  constructor(
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly friendsRepo = AppDataSource.getRepository(Friends),
    private readonly friendsNotificationRepo = AppDataSource.getRepository(FriendsNotification)

  ) { }

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
  async addNotification(senderUserId: string, receiverUserId: string) {
    if (senderUserId === receiverUserId) {
      return { message: 'you cannot send a friend request to yourself' }
    }
    const addFriendNotification = new FriendsNotification()
    addFriendNotification.sender_id = senderUserId
    addFriendNotification.receiver_id = receiverUserId

    await this.friendsNotificationRepo.save(addFriendNotification)
    return { message: Message.created }
  }

  async friendRequest(receiverUserId: string) {
    try {
      console.log(receiverUserId)
      const view = await this.friendsRepo.createQueryBuilder('friends')
        .leftJoinAndSelect('friends.sender', 'sender')
        .leftJoinAndSelect('sender.details', 'details')
        .leftJoinAndSelect('details.profileImage', 'profileImage')
        .where('friends.receiver_id=:receiverUserId', { receiverUserId })
        .andWhere('friends.status=:status', { status: Status.PENDING })

        .getMany()
      console.log(view)
      return view
    } catch (error) {
      throw HttpException.notFound
    }
  }
  async viewNotification(receiverUserId: string) {
    try {
      console.log('notification ma chai xa')
      console.log(receiverUserId)
      const view = await this.friendsNotificationRepo.createQueryBuilder('friendsNotification')
        .leftJoinAndSelect('friendsNotification.sender', 'sender')
        .leftJoinAndSelect('sender.details', 'details')
        .leftJoinAndSelect('details.profileImage', 'profileImage')
        .where('friendsNotification.receiver_id = :receiverUserId', { receiverUserId })
        .orderBy('friendsNotification.createdAt', 'DESC')
        .getMany();

      console.log("ya to pugo...")
      console.log(view, "notificaiton for the forntend")
      return view
    } catch (error) {
      throw HttpException.notFound
    }
  }
  // async getFriends(userId: string): Promise<Auth[]> {
  //   try {
  //     const allFriends = await this.connectRepo
  //       .createQueryBuilder('connection')
  //       .innerJoinAndSelect('connection.sender', 'sender')
  //       .innerJoinAndSelect('connection.receiver', 'receiver')
  //       .where('connection.sender_id= :userId OR connection.receiver_id= :userId', { userId })
  //       .andWhere('connection.status =:status', { status: Status.ACCEPTED })
  //       .getMany()
  //     console.log('🚀 ~ ConnectService ~ getFriends ~ allFriends:', allFriends)

  //     const friends: Auth[] = allFriends.map((connection) =>
  //       connection.sender.id === userId ? connection.receiver : connection.sender
  //     )
  //     console.log('🚀 ~ ConnectService ~ getFriends ~ friends:', friends)

  //     return friends
  //   } catch (error) {
  //     console.error(error)
  //     throw new Error('Error fetching friends list')
  //   }
  // }
  async viewFriends(receiverUserId: string) {
    try {
      console.log('jpt1');

      const view = await this.friendsRepo.find({
        where: [
          { receiver: { id: receiverUserId }, status: Status.ACCEPTED },
          { sender: { id: receiverUserId }, status: Status.ACCEPTED },
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


      const friends = view.map((friend) =>
        friend.sender.id === receiverUserId ? friend.receiver : friend.sender
      );

      return friends;
    } catch (error) {
      console.error('Error:', error);
      throw new HttpException('Not Found', 404);
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
    console.log(friendRequest, 'checking the reuqest')

    if (!friendRequest) {
      throw HttpException.notFound
    }


    friendRequest.status = Status.ACCEPTED;
    await this.friendsRepo.save(friendRequest);

    return friendRequest;
  }
  async delete(requestId: string) {
    const findRequest = await this.friendsRepo.findOne({
      where: {
        id: requestId
      }
    })
    if (findRequest) {
      this.friendsRepo.delete(requestId)
    } else {
      throw HttpException.notFound
    }
    return findRequest
  }
  async deleteFriend(requestId: string) {
    const findRequest = await this.friendsRepo.findOne({
      where: [
        { receiver_id: requestId },
        { sender_id: requestId }
      ]
    });
    console.log(findRequest, 'friend')
    if (findRequest) {
      this.friendsRepo.delete(findRequest.id)
    } else {
      throw HttpException.notFound
    }
    return findRequest
  }

}

export default new FriendService() 