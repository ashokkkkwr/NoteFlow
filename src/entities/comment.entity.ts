import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import {Notes} from './note/notes.entity'; // Import Notes entity
import Base from './base.entity';
import {User} from '../entities/user/user.entity';
@Entity('comment')
class Comment extends Base {
  @Column()
  comment: string;
  @ManyToOne(() => Notes, (note) => note.comments, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'post_id'})
  note: Notes;
  @ManyToOne(() => Comment, (comment) => comment.replies)
  @JoinColumn({name: 'parent_id'})
  parent: Comment | null;
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];
  @ManyToOne(() => User, (user) => user.comments, {nullable: true})
  @JoinColumn({name: 'user_id'})
  user: User | null;
}
export default Comment;