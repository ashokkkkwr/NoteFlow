import { AppDataSource } from '../config/database.config'
import { UserDetails } from '../entities/user/details.entity'
import { User } from '../entities/user/user.entity'
import { Message } from '../constant/messages'
import { UserDTO } from '../dto/user.dto'
class UserService {
    constructor(
        private readonly UserRepo = AppDataSource.getRepository(User)
    ){

    }
 
    async create(data: UserDTO): Promise<string> { 
        const user = new User()
        user.email = data.email
        user.password = data.password 
        const resUser = await user.save()
        const details = new UserDetails()
        details.first_name = data.first_name
        details.middle_name = data.middle_name
        details.last_name = data.last_name
        details.phone_number = data.phone_number
        details.user = resUser
        await details.save()
        return Message.created
    }
    async getAll(){
        return await this.UserRepo.createQueryBuilder('user')
/**
 * user is the entity that represents the realtionship.
 * arko parameter chai refer ko lagi matrai ho j name dida ni hunxa
 * 
 * 
 */
        .leftJoinAndSelect('user.details','details')
        .getMany()
    }
}

export default new UserService()