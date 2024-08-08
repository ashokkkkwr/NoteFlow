import { In } from 'typeorm';
import { AppDataSource } from '../config/database.config';
import { User } from '../entities/user/user.entity';
import { Room } from '../entities/room.entity';

export default class RoomService {
  private readonly roomRepository = AppDataSource.getRepository(Room);

  async findOrCreateIfNotExist(participants: string[]) {
    const room = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.participants', 'participants')
      .where('participants.id IN (:...participants)', { participants })
      .groupBy('room.id')
      .having('COUNT(participants.id) = :participantCount', { participantCount: participants.length })
      .getOne();
  
    if (room) {
      console.log(`Room found: ${room.id}`); // Debug log
      return room;
    } else {
      const users = await User.findBy({ id: In(participants) });
      const newRoom = this.roomRepository.create({ participants: users });
      const savedRoom = await this.roomRepository.save(newRoom);
      console.log(`Room created: ${savedRoom.id}`); // Debug log
      return savedRoom;
    }
  }
  

  async findRoom(participants: string[]) {
    return await this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.participants', 'participants')
      .where('participants.id IN (:...participants)', { participants })
      .groupBy('room.id')
      .having('COUNT(participants.id) = :participantCount', { participantCount: participants.length })
      .getOne();
  }
}
