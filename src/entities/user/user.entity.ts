import { UserDetails } from './details.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import Base from '../base.entity';
import {Notes} from '../note/notes.entity';
import { Role } from '../../constant/enum';
import { Friends } from '../../entities/friends.entity';
import { Message } from '../message.entity';
@Entity('user')
export class User extends Base {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => UserDetails, (details) => details.user, { cascade: true })
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

  @OneToMany(()=>Message,(message)=>message.sender)
  sentMessage:Message[];

  @OneToMany(()=>Message,(message)=>message.receiver)
  receivedMessage:Message[]

  @Column({nullable:true})
  token:string

  @Column({name:'opt_verified',default:false})
  otpVerified:boolean
}   