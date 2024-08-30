import Comment from '../entities/comment.entity'
import {Notes} from '../entities/note/notes.entity'
import { AppDataSource } from '../config/database.config'
import { CommentDTO } from '../dto/comment.dto'
import { IsNull } from 'typeorm';
import {User} from '../entities/user/user.entity'
import HttpException from '../utils/HttpException.utils';


class CommentService {
  constructor(
    private readonly NoteRepo = AppDataSource.getRepository(Notes),
    private readonly CommentRepo = AppDataSource.getRepository(Comment),
    private readonly userRepo = AppDataSource.getRepository(User)

  ) {}
  async create(userId:any,postId: string, data: CommentDTO) {
    const note = await this.NoteRepo.findOne({ where: { id: postId } });

    if (!note) {
      throw new Error('Note not found');
    }

    const user = await this.userRepo.findOne({where :{id:userId}})
    if(!user){
      throw new Error('Note not found');
    }

    let parentComment = null;
    if (data.parentId) {
      parentComment = await this.CommentRepo.findOne({ where: { id: data.parentId } });
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
    }
    const auth = await this.userRepo.findBy({ id: userId })
    console.log(auth)
    if (!auth) throw HttpException.notFound
    const addComment = this.CommentRepo.create({
      comment: data.comment,
      note: note,
      parent: parentComment,
      user:user
     

    });
    console.log("🚀 ~ CommentService ~ create ~ addComment:", addComment)
    
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
  async getComment(postId: string): Promise<Comment[]> {
    // Fetch the top-level comments with their immediate replies and user details
    const comments = await this.CommentRepo.find({
        where: {
            note: { id: postId },
            parent: IsNull(),
        },
        relations: ['replies', 'user', 'user.details','user.details.profileImage'],
    });

    // Recursively load replies and their details
    for (const comment of comments) {
        await this.loadReplies(comment);
    }

    return comments;
}

private async loadReplies(comment: Comment): Promise<void> {
    // Fetch replies with user details
    comment.replies = await this.CommentRepo.find({
        where: { parent: { id: comment.id } },
        relations: ['user', 'user.details','user.details.profileImage'],
    });

    // For each reply, fetch its replies and user details recursively
    for (const reply of comment.replies) {
        if (reply.user) {
            reply.user = await this.userRepo.findOne({
                where: { id: reply.user.id },
                relations: ['details','details.profileImage'],
            });
        }
        await this.loadReplies(reply); // Recursively load nested replies
    }
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