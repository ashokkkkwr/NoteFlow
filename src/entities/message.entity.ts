import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Base from './base.entity';
import { User } from './user/message.entity';

@Entity('messages')
export class Message extends Base {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column()
  sender_id: string;

  @Column()
  receiver_id: string;
}
