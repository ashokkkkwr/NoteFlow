import HttpException from '../utils/HttpException.utils'
import { AppDataSource } from '../config/database.config'
import { User } from '../entities/user/message.entity'
import { Message } from '../constant/messages'
import BcryptService from '../utils/bcryptService'
import userService from './user.service'
class AuthService {
  constructor(
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly bcryptService = new BcryptService()
  ) {}
  async login(data: User): Promise<User> {
    if (!data.email || !data.password) {
      throw HttpException.badRequest('Email and password are required');

    }
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
  async verifyEmail(email:string){
    const user = await this.userRepo.findOne({where:{email}})
 
    if(!user) throw HttpException.notFound(Message.notFound)
      return user 
  }
  async setToken(id:string,token:string):Promise<string>{
    await this.userRepo.update(id,{token})
    return Message.updated
  }
}


export default new AuthService()
