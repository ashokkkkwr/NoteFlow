import {Column,Entity,JoinColumn,ManyToOne,OneToOne} from 'typeorm'
import Base from './base.entity'
import { User } from './user/user.entity'
import { Notes } from './note/notes.entity'

@Entity('likes')
export class Like extends Base{
    @Column({name:'isLiked'})
    isLiked:boolean

    @ManyToOne(()=>User,user=>user.likes,{
        onDelete:'CASCADE'
    })
    @JoinColumn({name:'user_id'})
    user:User;

    @ManyToOne(()=>Notes,note=>note.likes,{
        onDelete:'CASCADE',
    })
    @JoinColumn({name:'note_id'})
    note:Notes
}