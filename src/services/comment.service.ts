import Comment from "../entities/comment.entity"
import Notes from "../entities/notes.entity"
import { AppDataSource } from "../config/database.config"
import { CommentDTO } from "../dto/comment.dto"
import { UUID } from "crypto";

class CommentService{

constructor(
    private readonly  NoteRepo = AppDataSource.getRepository(Notes),
    private readonly CommentRepo = AppDataSource.getRepository(Comment)
){
}
async create(postId: string, data: CommentDTO) {
  
      const note = await this.NoteRepo.findOne({ where: { id: postId } });
      console.log("Query result:", note);

      if (!note) {
        console.log('not found')
          throw new Error("Note not found");
      }
      const addComment = this.CommentRepo.create({
        comment:data.comment,
        note: note
      })
      await this.CommentRepo.save(addComment)
      console.log(this.CommentRepo)
      }
}
export default new CommentService()