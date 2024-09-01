import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Base from '../base.entity';
import { User } from '../user/user.entity';
import Comment from '../comment.entity';
import NoteMedia from './notesMedia.entity';
import { Like } from '../../entities/like.entity';
@Entity('notes')
export class Notes extends Base {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.note,{cascade:true})
  comments: Comment[];

  @OneToMany(() => NoteMedia, (noteMedia) => noteMedia.note, { cascade: true, onDelete: 'CASCADE' })
  noteMedia: NoteMedia[];

  @OneToMany(() => Like, like => like.note, { cascade: true })
  likes: Like[];
}
