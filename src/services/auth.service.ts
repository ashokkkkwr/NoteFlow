import HttpException from '../utils/HttpException.utils'
import { AppDataSource } from '../config/database.config'
import { User } from '../entities/user/user.entity'
import { Message } from '../constant/messages'
import BcryptService from '../utils/bcryptService'
import userService from './user.service'
class AuthService {
  constructor(
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly bcryptService = new BcryptService()
  ) {}
  async login(data: User): Promise<User> {
    const user = await this.userRepo.findOne({
      where: [
        {
          email: data.email,
        },
      ],
      select: ['id', 'email', 'password'],
    })
    if (!user) throw HttpException.notFound(Message.invalidCredentials)
    console.log(user.password, data.password)
    const isPasswordMatch = await this.bcryptService.compare(data.password, user.password)
    if (!isPasswordMatch) throw HttpException.notFound(Message.invalidCredentials)
    return await userService.getById(user.id)
  }
}


export default new AuthService()
