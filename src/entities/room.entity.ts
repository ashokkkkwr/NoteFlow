import { Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { User } from "./user/user.entity";
import  Base  from "./base.entity";
import { Message } from './message.entity';


@Entity()
export class Room extends Base {
    @ManyToMany(() => User)
    @JoinTable()
    participants: User[];

    @OneToMany(() => Message, (message) => message.room)
    messages: Message[];
  
    
}