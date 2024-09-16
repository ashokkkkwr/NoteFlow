import {Column, Entity, JoinColumn, OneToMany, OneToOne} from 'typeorm';
import Base from '../base.entity';
import {User} from './user.entity';
import UserMedia from './userMedia.entity';
@Entity('user_details')
export class UserDetails extends Base {
  @Column({})
  first_name: string;

  @Column({nullable: true})
  middle_name: string;

  @Column({})
  last_name: string;

  @Column({nullable: true})
  phone_number: string;

  @Column({nullable: true})
  gender: string;

  @OneToOne(() => User, (user) => user.details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({name: 'user_id'})
  user: User;

  @OneToMany(() => UserMedia, (media) => media.UserMedia)
  profileImage: UserMedia[];

  
}
