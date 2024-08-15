import { AppDataSource } from '../config/database.config'
import { UserDetails } from '../entities/user/details.entity'
import { User } from '../entities/user/user.entity'
import { Message } from '../constant/messages'
import { UserDTO } from '../dto/user.dto'
import HttpException from '../utils/HttpException.utils'
import BcryptService from '../utils/bcryptService'
import UserMedia from '../entities/user/userMedia.entity'
class UserService {
  constructor(
    private readonly UserRepo = AppDataSource.getRepository(User),
    private readonly DetailsRepo = AppDataSource.getRepository(UserDetails),
    private readonly bcryptService = new BcryptService(),
    private readonly MediaRepo = AppDataSource.getRepository(UserMedia)
  ) { }

  async create(data: UserDTO, img: any[]): Promise<string> {
    try {
      const alreadyExists = await this.UserRepo.findOne({
        where: { email: data.email },
      })
      const password = await this.bcryptService.hash(data.password)
      if (alreadyExists) throw HttpException.badRequest(` Email already in use`)

      if (!data.email || !data.password || !data.first_name || !data.last_name || !data.phone_number) {
        throw HttpException.badRequest(` Please fill all the input fields.`)
      }
      const user = this.UserRepo.create({
        email: data.email,
        password: password,
        role: data.role,
      })

      const users = await this.UserRepo.save(user)
      const details = this.DetailsRepo.create({
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        user: user,
      })
      const userDetails = await this.DetailsRepo.save(details)

      for (const j of img) {
        const image = this.MediaRepo.create({
          name: j.name,
          mimetype: j.mimiType,
          type: j.type,
          UserMedia: userDetails,
        })
        console.log(j.name, 'this is image detials')
        const img = await this.MediaRepo.save(image)
        img.transferImageFromTempTOUploadFolder(details.id, img.type)
      }

      return Message.created
    } catch (error: any) {
      throw HttpException.badRequest(error.message)
    }
  }

  async active(id: string) {
    try {
      const user = await this.UserRepo.findOne({
        where: { id: id }
      })
      if (!user) {
        throw new Error(`User with ID ${id} not found`)

      }
      user.active_status = true
      const data=await this.UserRepo.save(user)
      return {
         success: true,
          message: 'Update successful' ,
          data:data
        }

    } catch (error: any) {
      console.error('Error in update function:', error.message)
      return {
        success: false,
        message: 'Error occurred',
        originalError: error.message,
      }
    }
  }
  async offline(id:string){
    try {
      const user = await this.UserRepo.findOne({
        where: { id: id }
      })
      if (!user) {
        throw new Error(`User with ID ${id} not found`)

      }
      user.active_status = false
      const data=await this.UserRepo.save(user)
      return {
         success: true,
          message: 'Update successful' ,
          data:data
        }

    } catch (error: any) {
      console.error('Error in update function:', error.message)
      return {
        success: false,
        message: 'Error occurred',
        originalError: error.message,
      }
    }
  }
  async update(data: UserDTO, img: any[], userId: string) {
    try {
      const user = await this.UserRepo.findOne({
        where: { id: userId },
        relations: ['details'],
      })

      if (!user) {
        throw new Error(`User with ID ${userId} not found`)
      }
      user.email = data.email
      user.role = data.role

      const updatedUser = await this.UserRepo.save(user)

      let userDetails = user.details

      if (!userDetails) {
        userDetails = this.DetailsRepo.create()
        userDetails.user = updatedUser
      }
      userDetails.first_name = data.first_name
      userDetails.middle_name = data.middle_name
      userDetails.last_name = data.last_name
      userDetails.phone_number = data.phone_number
      const updatedUserDetails = await this.DetailsRepo.save(userDetails)
      await this.MediaRepo.delete({ UserMedia: updatedUserDetails })
      // Add new media entries
      for (const j of img) {
        const image = this.MediaRepo.create({
          name: j.name,
          mimetype: j.mimiType,
          type: j.type,
          UserMedia: updatedUserDetails,
        })
        console.log(image)
        const savedImage = await this.MediaRepo.save(image)
        savedImage.transferImageFromTempTOUploadFolder(updatedUserDetails.id, savedImage.type)
      }
      return updatedUserDetails
    } catch (error: any) {
      console.error('Error in update function:', error.message)
      return {
        success: false,
        message: 'Error occurred',
        originalError: error.message,
      }
    }
  }
  async getAll() {
    try {
      return await this.UserRepo.createQueryBuilder('user')
        .leftJoinAndSelect('user.details', 'details')
        .leftJoinAndSelect('details.profileImage', 'profileImage')
        .getMany()
    } catch (error: any) {
      throw HttpException.badRequest(error.message)
    }
  }
  async getById(id: string) {
    console.log(id,"service ko id")
    const query = this.UserRepo.createQueryBuilder('user').where('user.id=:id', { id })
    query.leftJoinAndSelect('user.details', 'details')
      .leftJoinAndSelect('details.profileImage', 'profileImage')

    const user = await query.getOne()
    if (!user) throw HttpException.notFound(Message.notFound)
    return user
  }
  async delete(id: string) {
    const query = this.UserRepo.createQueryBuilder('user').where('user.id=:id', { id })
    query.leftJoinAndSelect('user.details', 'details')
    const user = await query.getOne()
    if (!user) throw HttpException.notFound(Message.notFound)
    await this.UserRepo.remove(user)
    return { message: 'User deleted successfully' }
  }
}
export default new UserService()
