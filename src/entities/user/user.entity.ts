import { UserDetails } from "./details.entity";
import{Column,Entity, OneToOne }from 'typeorm'
import Base from'../base.entity'
@Entity('user')
export class User extends Base{
    @Column({
        
    })
    email:string
    @Column({

    })
    password:string
    @OneToOne(() => UserDetails, (details) => details.user, { cascade: true })
    details: UserDetails
}
