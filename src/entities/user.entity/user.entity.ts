import {Column,Entity,OneToOne} from 'typeorm'
import Base from '../base.entity'
import { UserDetails } from './details.entity'

@Entity('user')
export class User extends Base{

    @Column({
       unique:true,
    })
    email:string
    @Column({})
    password:string

    @OneToOne(()=>UserDetails,(details)=>details.user,{cascade:true})
    details:UserDetails
}