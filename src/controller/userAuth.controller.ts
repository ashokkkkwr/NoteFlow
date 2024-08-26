import { StatusCodes } from '../constant/statusCodes'
import userService from '../services/user.service'
import authService from '../services/auth.service'
import { type Request, type Response } from 'express'
import { Message } from '../constant/messages'
import { UserDTO } from '../dto/user.dto'
import webTokenService from '../utils/webToken.service'
import { Role } from '../constant/enum'
import HttpException from '../utils/HttpException.utils'
import { OtpService } from '../services/utils/otp.services'
import { HashService } from '../services/utils/hash.service'
import AppError from '../utils/HttpException.utils'
export class UserAuthController {
  constructor(private readonly hashService = new HashService(),
    private readonly otpService = new OtpService()) { }
  async create(req: Request, res: Response) {
    if (req?.files?.length === 0) throw AppError.badRequest('Please select a file.')
    console.log(req?.files, "iamge details")
    const img = req?.files?.map((file: any) => {
      return {
        name: file?.filename,
        mimiType: file?.mimetype,
        type: req.body?.type,
      }
    })

    const bodyRole = req.body?.role
    if (bodyRole === Role.SUDO_ADMIN) throw HttpException.forbidden(Message.notAuthorized)
    await userService.create(req.body as UserDTO, img)
    res.status(StatusCodes.CREATED).json({
      status: true,
      message: Message.created,
    })
  }
  async signup(req: Request, res: Response) {
    if (req?.files?.length === 0) throw AppError.badRequest('Please select a file')
    console.log(req?.files, "iamge details")
    const img = req?.files?.map((file: any) => {
      return {
        name: file?.filename,
        mimiType: file?.mimetype,
        type: req.body?.type,
      }
    })
    const bodyRole = req.body?.role
    if (bodyRole === Role.SUDO_ADMIN) throw HttpException.forbidden(Message.notAuthorized)
    await userService.create(req.body as UserDTO, img)
    res.status(StatusCodes.CREATED).json({
      status: true,
      message: Message.created,
    })
  }
  async update(req: Request, res: Response) {
    const bodyRole = req.body?.role
    console.log("🚀 ~ UserAuthController ~ update ~ bodyRole:", bodyRole)
    const userId = req.params.id
    const body=req.body
    console.log("🚀 ~ UserAuthController ~ update ~ body:", body)
    // const updated = await userService.update(body, img, userId)
    const updated = await userService.update(body, userId)
    console.log("🚀 ~ UserAuthController ~ update ~ req.body :", req.body )
    res.status(StatusCodes.CREATED).json({
      status: true,
      message: Message.created,
      data:updated
    })
  }
  async updatePassword(req:Request,res:Response){
    try{
      const userId = req.user?.id
      console.log("🚀 ~ UserAuthController ~ updatePassword ~ userId:", userId)
      const body=req.body
      console.log("🚀 ~ UserAuthController ~ updatePassword ~ body:", body)
  
      const data= await authService.updatePassword(userId as string,body)
      console.log("🚀 ~ UserAuthController ~ updatePassword ~ data:", data)
      
      res.status(StatusCodes.CREATED).json({
        status:true,
        message:Message.updated,
        data:data
      })
    }catch(error: any) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    
    }
   
    
  }
  async getAll(req: Request, res: Response) {
    const data = await userService.getAll()
    console.log(data)
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: Message.fetched,
      data: data,
    })
  }
  async getOne(req: Request, res: Response) {
    const id = req.params.id

    const data = await userService.getById(id)
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: Message.fetched,
      data: data
    })
  }
  async getByToken(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      console.log(userId, 'yo chai user ko id')
      const data = await userService.getById(userId as string)
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: Message.fetched,
        data: data
      })
    } catch (error) {
      console.log(error, 'yoyyooyoyo')
    }
  }
  async delete(req: Request, res: Response) {
    const id = req.params.id
    const data = await userService.delete(id)
    res.status(StatusCodes.SUCCESS).json({
      status: true,
      message: Message.deleted,
      data: data
    })
  }
  async login(req: Request, res: Response) {
    try {
      const data = await authService.login(req.body)

      const tokens = webTokenService.generateTokens(
        {
          id: data.id,
        },
        data.role
      )
      res.status(StatusCodes.SUCCESS).json({
        data: {
          user: {
            id: data.id,
            email: data.email,
            details: {
              firstName: data.details.first_name,
              lastName: data.details.last_name,
              phoneNumber: data.details.phone_number,
            },
          },
          tokens: {
            accessToken: tokens.accessToken,
            refreshToke: tokens.refreshToken,
          },
        },
        message: Message.loginSuccessfully,
      })
    } catch (error: any) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    }

  }
  async googleLogin(req: Request, res: Response) {
    try {
      const googleId = req.body.googleId
      const data = await authService.googleLogin(googleId)
      const tokens = webTokenService.generateTokens(
        {
          id: data.id,
        },
        data.role
      )
      res.status(StatusCodes.SUCCESS).json({
        data: {
          user: {
            id: data.id,
            email: data.email,
            details: {
              firstName: data.details.first_name,
              lastName: data.details.last_name,
              phoneNumber: data.details.phone_number,
            },
          },
          tokens: {
            accessToken: tokens.accessToken,
            refreshToke: tokens.refreshToken,
          },
        },
        message: Message.loginSuccessfully,
      })
    } catch (error: any) {
      res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    }
  }




}

