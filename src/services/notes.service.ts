import { AppDataSource } from '../config/database.config'
import HttpException from '../utils/HttpException.utils'
import { Notes } from '../entities/note/notes.entity'
import { User } from '../entities/user/user.entity'
import { NotesDTO, UpdateNotesDTO } from '../dto/notes.dto'
import { Message } from '../constant/messages'
import NoteMedia from '../entities/note/notesMedia.entity'
// import transferImageFromUploadToTemp from '../entities/note/notesMedia.entity'
import { transferImageFromUploadToTemp } from '../utils/path.utils'
import Comment from '../entities/comment.entity'
class NotesService {
  constructor(
    private readonly notesRepo = AppDataSource.getRepository(Notes),
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly imageRepo = AppDataSource.getRepository(NoteMedia),
    private readonly commentRepo = AppDataSource.getRepository(Comment)

  ) {}
  async create(userId: any, data: NotesDTO, img: any[]) {
    console.log(userId, 'user ID')
    console.log('image object')

    const auth = await this.userRepo.findBy({ id: userId })
    console.log(auth)
    if (!auth) throw HttpException.notFound

    const note = this.notesRepo.create({
      title: data.title,
      content: data.content,
      user: userId,
    })

    const pk = await this.notesRepo.save(note)
    for (const j of img) {
      const image = this.imageRepo.create({
        name: j.name,
        mimetype: j.mimiType,
        type: j.type,
        note: pk,
      })
      console.log(j)
      const img = await this.imageRepo.save(image)

      img.transferImageFromTempTOUploadFolder(note.id, img.type)
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
    try {
      return await this.notesRepo
        .createQueryBuilder('notes')
        .leftJoinAndSelect('notes.noteMedia', 'noteMedia')
        .leftJoinAndSelect('notes.user', 'user')
        .leftJoinAndSelect('notes.likes', 'likes')
        .leftJoinAndSelect('likes.user', 'users')


        .leftJoinAndSelect('user.details', 'details')
        .leftJoinAndSelect('details.profileImage', 'profileImage')
        .getMany()
    } catch (error: any) {
      throw HttpException.badRequest(error.message)
    }
    // const notes = await this.notesRepo.find({  relations: ['user'] })

    // return notes
  }
  async update(userId: string, noteId: string, data: NotesDTO, img: any[]) {
    try {
      console.log("hhaa")
      const notes = await this.notesRepo.findOneBy({ id: noteId })
      console.log('🚀 ~ NotesService ~ update ~ notes:', notes)
      if (!notes) throw HttpException.notFound
      console.log(data,"data")
      notes.title = data.title
      notes.content = data.content
      const updatedNote = await this.notesRepo.save(notes)
      console.log('🚀 ~ NotesService ~ update ~ updatedNote:', updatedNote)
      const media = await this.imageRepo.find({
        where: {
          note: {
            id: noteId,
          },
        },
        relations: ['note'],
      })
      console.log(noteId)
      console.log("🚀 ~ NotesService ~ update ~ media:", media)
      if(media){
        if (media.length > 0) {

          for (const mediaItem of media) {
            transferImageFromUploadToTemp(mediaItem.id, mediaItem.name, mediaItem.type)
          }
          await this.imageRepo
            .createQueryBuilder()
            .delete()
            .from(NoteMedia)
            .where('note.id = :noteId', { noteId })
            .execute()
        }
        for (const file of img) {
          const saveMedia = new NoteMedia()
          saveMedia.name = file.name
          saveMedia.mimetype = file.mimetype
          saveMedia.type = file.type
          saveMedia.note = updatedNote
          const savedImage = await this.imageRepo.save(saveMedia)
          savedImage.transferImageFromTempTOUploadFolder(notes.id, savedImage.type)
        }
      }
     
      return Message.updated
    } catch (error) {
      console.log('🚀 ~ NotesService ~ update ~ error:', error)
    }
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
    await this.commentRepo.delete({ note: { id: noteId } });

    // Delete the note
    await this.notesRepo.delete(note.id);
    return note
  }
}
export default new NotesService()
