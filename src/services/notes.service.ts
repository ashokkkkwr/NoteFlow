import { AppDataSource } from '../config/database.config'
import HttpException from '../utils/HttpException.utils'
import {Notes} from '../entities/note/notes.entity'
import { User } from '../entities/user/message.entity'
import { NotesDTO, UpdateNotesDTO } from '../dto/notes.dto'
import { Message } from '../constant/messages'
import NoteMedia from '../entities/note/notesMedia.entity'

class NotesService {
  constructor(
    private readonly notesRepo = AppDataSource.getRepository(Notes),
    private readonly userRepo = AppDataSource.getRepository(User),
    private  readonly imageRepo = AppDataSource.getRepository(NoteMedia)
  ) {}
  async create(userId: any, data: NotesDTO,img :any[]) {
    console.log(userId,"user ID")
    console.log("image object")
 
    const auth = await this.userRepo.findBy({id:userId})
    console.log(auth)
    if(!auth) throw HttpException.notFound


    const note = this.notesRepo.create({
      title: data.title,
      content: data.content,
      user: userId,
    })
 
   const pk= await this.notesRepo.save(note)
    for(const j of img){
      const image = this.imageRepo.create({
        name:j.name,
        mimetype:j.mimiType,
        type:j.type,
        note:pk

      }) 
      console.log(j)
      const img=await this.imageRepo.save(image) 

      img.transferImageFromTempTOUploadFolder(note.id,img.type)
    }

  

    return note
  }
  async getOne(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId })

    if (!user) {
      throw HttpException.notFound(Message.notFound)
    }
    const notes = await this.notesRepo.find({
      select: ['title', 'content'],
      where: { user: { id: userId } },
    })
    return notes
  }
  // async getAll() {
  //   try {
  //     return await this.UserRepo.createQueryBuilder('user')
  //       .leftJoinAndSelect('user.details', 'details')
  //       .leftJoinAndSelect('details.profileImage', 'profileImage')
  //       .getMany()
  //   } catch (error: any) {
  //     throw HttpException.badRequest(error.message)
  //   }
  // }
  async getAll() {
    try{
      return await this.notesRepo.createQueryBuilder('notes')
      .leftJoinAndSelect('notes.noteMedia','noteMedia')
      .leftJoinAndSelect('notes.user','user')
      .leftJoinAndSelect('user.details','details')
      .leftJoinAndSelect('details.profileImage','profileImage')
      .getMany()
    }catch(error:any){
      throw HttpException.badRequest(error.message)
    }
    // const notes = await this.notesRepo.find({  relations: ['user'] })

    // return notes
  }
  async update(userId: string, noteId: string, data: UpdateNotesDTO) {
    // Checks if the note with the given noteId belongs to the user with the token userId
    const note = await this.notesRepo.findOneBy({ id: noteId, user: { id: userId } })
    if (!note) {
      throw HttpException.notFound(Message.notFound)
    }
    // The merge method merges the existing note object with the updated data provided.
    this.notesRepo.merge(note, data)
    await this.notesRepo.save(note)
    return note
  }

  async delete(userId: string, noteId: string) {
    /**
SELECT n.*
FROM notes n
JOIN users u ON n.user_id = u.id
WHERE n.id = $1 AND u.id = $2;
 */
    const note = await this.notesRepo.findOneBy({
      id: noteId,
      user: { id: userId },
    })
    if (!note) {
      throw HttpException.notFound(Message.notFound)
    }
    this.notesRepo.delete(note.id)
    return note
  }
}
export default new NotesService()
