import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Notes from './notes.entity'; // Import Notes entity
import Base from './base.entity';
@Entity('comment')
class Comment extends Base {
  @Column()
  comment: string;

  @ManyToOne(() => Notes, (note) => note.comment)
  @JoinColumn({ name: 'post_id' })
  note: Notes;

  @ManyToOne(()=>Comment,(comment)=>comment.replies)
  @JoinColumn({name:'parent_id'})
  parent:Comment|null;

  @OneToMany(()=>Comment,(comment)=>comment.parent)
  replies:Comment[];


}

export default Comment;