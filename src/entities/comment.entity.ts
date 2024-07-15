import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Notes from './notes.entity'; // Import Notes entity
import Base from './base.entity';
@Entity('comment')
class Comment extends Base {
  @Column()
  comment: string;

  @ManyToOne(() => Notes, (note) => note.comment)
  @JoinColumn({ name: 'post_id' })
  note: Notes;
}

export default Comment;
