import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import Base from './base.entity';
import { Status } from '../constant/enum';
import { User } from './user/user.entity';

@Entity('friends')
export class Friends extends Base {
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;
  @Column()
  sender_id:string
  @Column()
  receiver_id:string
}
