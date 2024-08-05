import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Base from '../base.entity';
import { User } from '../user/message.entity';
import Comment from '../comment.entity';
import NoteMedia from './notesMedia.entity';
@Entity('notes')
export class Notes extends Base {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.note)
  comments: Comment[];

  @OneToMany(() => NoteMedia, (noteMedia) => noteMedia.note)
  noteMedia: NoteMedia[];
}
