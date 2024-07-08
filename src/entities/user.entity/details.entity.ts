import {Column,Entity,JoinColumn,OneToOne} from 'typeorm'
import Base from '../base.entity'

@Entity('user_details')
export class UserDetails extends Base
{
    
    @Column({})
     first_name:string

     @Column({})
     middle_name:string

     @Column({})
     last_name:string
     
     
     @Column({})
     phone_number:string

    

}