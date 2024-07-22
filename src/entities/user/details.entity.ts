import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import Base from '../base.entity'
import { User } from './user.entity'
import UserMedia from './userMedia.entity'
@Entity('user_details')
export class UserDetails extends Base {
  @Column({})
  first_name: string

  @Column({})
  middle_name: string

  @Column({})
  last_name: string

  @Column({})
  phone_number: string

  @OneToOne(() => User, (user) => user.details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User


  @OneToMany(() => UserMedia, (media) => media.UserMedia)
  profileImage: UserMedia[];


}
