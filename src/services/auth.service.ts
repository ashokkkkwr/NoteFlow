import HttpException from '../utils/HttpException.utils';
import {AppDataSource} from '../config/database.config';
import {User} from '../entities/user/user.entity';
import {Message} from '../constant/messages';
import BcryptService from '../utils/bcryptService';
import userService from './user.service';
import {jwtDecode} from 'jwt-decode';
import {UserDetails} from '../entities/user/details.entity';
import {UserDTO} from '../dto/user.dto';
class AuthService {
  constructor(
    private readonly userRepo = AppDataSource.getRepository(User),
    private readonly detailsRepo = AppDataSource.getRepository(UserDetails),

    private readonly bcryptService = new BcryptService(),
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
    });

    if (!user) throw HttpException.notFound(Message.invalidCredentials);
    console.log(user.password, data.password);
    const isPasswordMatch = await this.bcryptService.compare(data.password, user.password);
    if (!isPasswordMatch) throw HttpException.notFound(Message.invalidCredentials);
    return await userService.getById(user.id);
  }
  async verifyEmail(email: string) {
    const user = await this.userRepo.findOne({where: {email}});
    if (!user) throw HttpException.notFound(Message.notFound);
    return user;
  }
  async setToken(id: string, token: string): Promise<string> {
    await this.userRepo.update(id, {token});
    return Message.updated;
  }
  async googleLogin(googleId: string): Promise<any> {
    try {
      console.log('haha')
      const decoded: any = jwtDecode(googleId);
      console.log("🚀 ~ AuthService ~ googleLogin ~ decoded:", decoded)
      const user = await this.userRepo.findOne({
        where: {email: decoded.email},
        relations: ['details'],
      });
      console.log("🚀 ~ AuthService ~ googleLogin ~ user:", user)
      if (!user) {
        try {
          const user = new User();
          user.email = decoded?.email;
          console.log("🚀 ~ AuthService ~ googleLogin ~ decoded?.email;:", decoded?.email)
          user.password = await this.bcryptService.hash(decoded?.sub);

          const save = await this.userRepo.save(user);
          console.log("🚀 ~ AuthService ~ googleLogin ~ save:", save)
          
          if (save) {
            const details = new UserDetails();
            details.user = save;
            console.log("🚀 ~ AuthService ~ googleLogin ~ save:", save)
            details.first_name = decoded.given_name;
            console.log("🚀 ~ AuthService ~ googleLogin ~ decoded.given_name:", decoded.given_name)
            details.last_name = decoded.family_name;
            console.log("🚀 ~ AuthService ~ googleLogin ~ decoded.family_name:", decoded.family_name)
            // details.gender = decoded.gender;
            // console.log("🚀 ~ AuthService ~ googleLogin ~ decoded.gender:", decoded.gender)
            try{
              const x= await this.detailsRepo.save(details);
            }catch(error){
              console.log("🚀 ~ AuthService ~ googleLogin ~ error:", error)
              
            }
           
            // console.log("🚀 ~ AuthService ~ googleLogin ~ x:", x)
            console.log("🚀 ~ AuthService ~ googleLogin ~ saved:", save)
            return await userService.getById(save?.id);
          }
        } catch (error) {
          throw HttpException.badRequest(Message.error);
        }
      }else{
        return await userService.getById(user.id)
      }
    } catch (error) {
      throw HttpException.badRequest(Message.error);
    }
  }
  async updatePassword(userId: string, body: any) {
    console.log('🚀 ~ AuthService ~ updatePassword ~ userId:', userId);

    try {
      // Find the user by ID
      const user = await this.userRepo.findOne({
        where: {id: userId},
      });
      console.log('🚀 ~ AuthService ~ updatePassword ~ user:', user);

      if (!user) {
        throw HttpException.notFound(`User not found`);
      }

      // Compare the provided password with the existing hashed password
      const isPasswordMatch = await this.bcryptService.compare(body.password, user.password);

      if (!isPasswordMatch) {
        throw HttpException.badRequest(`Please enter the correct password`);
      }

      // Hash the new password
      const hashedPassword = await this.bcryptService.hash(body.updatedPassword);

      // Update the user's password with the new hashed password
      user.password = hashedPassword;

      // Save the updated user record to the database
      const save = await this.userRepo.save(user);
      return save;
    } catch (error) {
      console.error('🚀 ~ AuthService ~ updatePassword ~ error:', error);
      throw HttpException.badRequest(`Error updating password`);
    }
  }
  async setOptVerified(email:string,verify:boolean){
    await this.userRepo.update({email},{otpVerified:verify})
    return Message.updated
  }
  async resetPassword(data:any){
    try{  
      console.log(data.email)
      const user= await this.userRepo.findOne({
        where: {email:data.email,otpVerified: true}
      })
      console.log("🚀 ~ AuthService ~ resetPassword ~ user:", user)
      if(!user)throw HttpException.notFound(Message.notFound)
      const [expires]=user.token.split('.')
      if(Date.now()>+expires) throw HttpException.badRequest(Message.otpExpired)
      const hashedPassword = await this.bcryptService.hash(data.newPassword)
      const update=this.userRepo.update({id:user.id},{password:hashedPassword,otpVerified:false,token:''})
      return update
    }catch(error:any){
      throw HttpException.badRequest(error.message)
    }
  }
}

export default new AuthService();
