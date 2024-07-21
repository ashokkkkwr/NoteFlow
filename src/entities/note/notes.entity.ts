import { Column, ManyToOne, Entity, JoinColumn, OneToMany } from 'typeorm';
import Base from '../base.entity';
import { User } from '../user/user.entity';
import Comment from '../comment.entity'
import { NoteMedia } from './notesMedia';
@Entity('notes')
export class Notes extends Base {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) =>   user.notes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(()=>Comment,(comment)=>comment.note)
  comment:Comment[]

  @OneToMany(()=>NoteMedia,(noteMedia)=>noteMedia.notes)
  postImage:Notes[]

}

export default Notes;
