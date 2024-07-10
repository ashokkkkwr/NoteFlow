import { AppDataSource } from "../config/database.config";
import HttpException from "../utils/HttpException.utils";
import Notes from "../entities/notes.entity";
import { User } from "../entities/user/user.entity";
import {NotesDTO} from '../dto/notes.dto'
import { Message } from "../constant/messages";

class NotesService{
    constructor(
        private readonly notesRepo = AppDataSource.getRepository('Notes'),
        private readonly userRepo = AppDataSource.getRepository('User')
    ){
        
    }
    async create(userId:string,data:NotesDTO){
     const user = await this.userRepo.findOneBy({id:userId});
     if(!user){
        throw HttpException.notFound(Message.notFound);
     }
     const note=this.notesRepo.create({...data,user});
     await this.notesRepo.save(note)
        
    }
    async getOne(userId:string){
        const user = await this.userRepo.findOneBy({id:userId});

        if(!user){
            throw HttpException.notFound(Message.notFound)
        }
        const notes = await this.notesRepo.find({
            select:['title','content'],
            where:{user:{id:userId}}
        });
        return notes
    }
    async getAll(){
        const notes = await this.notesRepo.find({

        });
        return notes
    }
}
export default new NotesService();
