import {AppDataSource} from '../config/database.config'
import { UserDetails } from '../entities/user.entity/details.entity'
import { Message } from '../constant/messages'
class UserService{
    constructor(
        private readonly UserRepo= AppDataSource.getRepository(UserDetails),
    ){

    }
    async create(data:UserDetails):Promise<string>{
        const user=this.UserRepo.create(data)
        await this.UserRepo.save(user)
        return Message.created
    }
}








export default new UserService()