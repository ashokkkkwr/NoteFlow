import { Column,ManyToOne,Entity, JoinColumn } from "typeorm";
import Base from "./base.entity";
import { User } from "./user/user.entity";


@Entity('notes')
class Notes extends Base
{

  

    @Column({})
    title:'string'

    @Column({})
    content:'string'

    @ManyToOne(()=>User,user=>user.notes)
    @JoinColumn({name:'user_id'})
    user:User


}


export default Notes;