import HttpException from '../utils/HttpException.utils'
import { AppDataSource } from '../config/database.config'
import { User } from '../entities/user/user.entity'
import { Message } from '../constant/messages'
import BcryptService from '../utils/bcryptService'
import userService from './user.service'
import { jwtDecode } from 'jwt-decode'
import { UserDetails } from '../entities/user/details.entity'
class AuthService {
  constructor(
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly detailsRepo = AppDataSource.getRepository(UserDetails),

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
  async googleLogin(googleId:string):Promise<any>{
    try{
      const decoded: any = jwtDecode(googleId)
      const user = await this.userRepo.findOne({
        where:{email:decoded.email},
        relations:['details'],
      })
      if(!user){
        try{
        const user = new User()
        user.email=decoded?.email
        user.password = await this.bcryptService.hash(decoded?.sub)

        const save = await this.userRepo.save(user)
        if(save){
          const details = new UserDetails()
          details.user = save
          details.first_name = decoded.given_name
          details.last_name=decoded.family_name
          details.gender = decoded.gender
          await this.detailsRepo.save(details)
          return await userService.getById(save.id)
          
        }
      }catch(error){
        throw HttpException.badRequest(Message.error)

      }
      }
    }catch(error){
      throw HttpException.badRequest(Message.error)
    }
  }
}


export default new AuthService()
