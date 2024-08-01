import Comment from '../entities/comment.entity'
import {Notes} from '../entities/note/notes.entity'
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
  async getComment(postId:string){

    const comments = await this.CommentRepo.find({
// checks where the note (or post) has an id equal to postId.
      where:{note:{id:postId}},
      parent:IsNull ,
/**The relations array specifies related entities to load along with the 
 * main entity. In this case, it tells TypeORM to also load the replies 
 * for each comment. */
      relations:['replies'],
    })
    console.log(comments,"com")
    return comments
  }
  async deleteComment(commentId:string){
    const comment = await this.CommentRepo.findOne({where:{id:commentId},relations:['replies']});
    if (!comment) {
      throw new Error('Comment not found');
    }
    if(comment.replies && comment.replies.length>0){
      for(const reply of comment.replies){
        await this.CommentRepo.remove(reply)
      }
    }
  }
}
export default new CommentService()