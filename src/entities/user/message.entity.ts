import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import Base from '../base.entity';
import { UserDetails } from './details.entity';
import { Notes } from '../note/notes.entity';
import { Role, Status } from '../../constant/enum';
import { Friends } from '../friends.entity';
import { Message } from '../message.entity';  // Import the Message entity

@Entity('user')
export class User extends Base {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserDetails, (details) => details.user, { cascade: true })
  @JoinColumn()
  details: UserDetails;

  @OneToMany(() => Notes, (note) => note.user)
  notes: Notes[];

  @Column({
    type: 'enum',
    enum: Role,
    nullable: true,
  })
  role: Role;

  @OneToMany(() => Friends, (friends) => friends.sender)
  sentFriendRequests: Friends[];

  @OneToMany(() => Friends, (friends) => friends.receiver)
  receivedFriendRequests: Friends[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @Column({ nullable: true })
  token: string;

  @Column({ name: 'otp_verified', default: false })
  otpVerified: boolean;
}
