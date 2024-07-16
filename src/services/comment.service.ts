import Comment from '../entities/comment.entity'
import Notes from '../entities/notes.entity'
import { AppDataSource } from '../config/database.config'
import { CommentDTO } from '../dto/comment.dto'
import { IsNull } from 'typeorm';


class CommentService {
  constructor(
    private readonly NoteRepo = AppDataSource.getRepository(Notes),
    private readonly CommentRepo = AppDataSource.getRepository(Comment)
  ) {}
  async create(postId: string, data: CommentDTO) {
    const note = await this.NoteRepo.findOne({ where: { id: postId } });

    if (!note) {
      throw new Error('Note not found');
    }

    let parentComment = null;
    if (data.parentId) {
      parentComment = await this.CommentRepo.findOne({ where: { id: data.parentId } });
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
    }
    console.log(parentComment,"parent comment")
    const addComment = this.CommentRepo.create({
      comment: data.comment,
      note: note,
      parent: parentComment,
    });
    await this.CommentRepo.save(addComment);
    return addComment;
  }
  async update(commentId: string, data: CommentDTO) {
    const comment = await this.CommentRepo.findOne({ where: { id: commentId } })
    console.log(comment)
    if (!comment) {
      throw new Error('comment not found')
    }

    // Update the comment entity with new data
    comment.comment = data.comment
    // Save the updated comment entity
    const updatedComment = await this.CommentRepo.save(comment)
    return updatedComment
  }
  async comment(postId:string){

    const comments = await this.CommentRepo.find({
// checks where the note (or post) has an id equal to postId.
      where:{note:{id:postId}},
/**The relations array specifies related entities to load along with the 
 * main entity. In this case, it tells TypeORM to also load the replies 
 * for each comment. */
      relations:['replies'],
    })
    console.log(comments,"com")
    return comments
  }
}
export default new CommentService()