import { AppDataSource } from '../config/database.config'
import { UserDetails } from '../entities/user/details.entity'
import { User } from '../entities/user/user.entity'
import { Message } from '../constant/messages'
import { UserDTO } from '../dto/user.dto'
import HttpException from '../utils/HttpException.utils'
import BcryptService from '../utils/bcryptService'
class UserService {
  constructor(
    private readonly UserRepo = AppDataSource.getRepository(User),
    private readonly bcryptService = new BcryptService()
  ) {}

  async create(data: UserDTO): Promise<string> {
    try {
      const alreadyExists = await this.UserRepo.findOne({
        where: { email: data.email },
      })
      if (alreadyExists) throw HttpException.badRequest(` Email already in use`)
      const user = new User()
      user.email = data.email
      user.password = data.password
      user.password = await this.bcryptService.hash(data.password)
      user.role=data.role
      const resUser = await user.save()
      const details = new UserDetails()
      details.first_name = data.first_name
      details.middle_name = data.middle_name
      details.last_name = data.last_name
      details.phone_number = data.phone_number
      details.user = resUser
      await details.save()
      return Message.created
    } catch (error: any) {
      throw HttpException.badRequest(error.message)
    }
  }

  async getAll() {
    try {
      return await this.UserRepo.createQueryBuilder('user')

        /**
         * user is the entity that represents the realtionship.
         * arko parameter chai refer ko lagi matrai ho j name dida ni hunxa
         */
        .leftJoinAndSelect('user.details', 'details')
        .getMany()
    } catch (error: any) {
      throw HttpException.badRequest(error.Message)
    }
  }

  async getById(id: string) {
    const query = this.UserRepo.createQueryBuilder('user').where('user.id=:id', { id })
    query.leftJoinAndSelect('user.details', 'details')
    const user = await query.getOne()
    if (!user) throw HttpException.notFound(Message.notFound)
    return user
  }
}
export default new UserService()
