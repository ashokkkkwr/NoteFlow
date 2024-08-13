import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'
import Base from './base.entity'
import { User } from './user/user.entity'

@Entity('friendsNotification')
export class FriendsNotification extends Base {
  @Column({ default: false })
  read: boolean

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  @JoinColumn({ name: 'sender_id' })
  sender: User

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User

  @Column()
  sender_id: string

  @Column()
  receiver_id: string
}
