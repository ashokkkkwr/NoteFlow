import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Base from './base.entity';
import { User } from './user/user.entity';
import { Room } from './room.entity';

@Entity('messages')
export class Message extends Base {
  @Column()
  content: string;

  @Column({ default: false, nullable: true })
  read: boolean;

  @ManyToOne(() => User, (user) => user.sentMessage)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessage)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column()
  sender_id: string;

  @Column()
  receiver_id: string;

  @ManyToOne(() => Room, (room) => room.messages)
  @JoinColumn({ name: 'room_id' })
  room: Room;



}
