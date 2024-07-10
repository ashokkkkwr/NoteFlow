import { UserDetails } from './details.entity'
import { Column, Entity, OneToMany, OneToOne } from 'typeorm'
import Base from '../base.entity'
import Notes from '../notes.entity'
import { Role } from '../../constant/enum'
@Entity('user')
export class User extends Base {
  @Column({})
  email: string
  @Column({})
  password: string
  @OneToOne(() => UserDetails, (details) => details.user, { cascade: true })
  details: UserDetails
  @OneToMany(() => Notes, (note) => note.user)
  notes: Notes[]
  @Column({
    type: 'enum',
    enum: Role,
    nullable: true,
  })
  role: Role
}
