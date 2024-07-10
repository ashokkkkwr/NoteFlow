import { StatusCodes } from "../constant/statusCodes"
import userService from "../services/user.service"
import authService from '../services/auth.service'
import { type Request,type Response } from "express"
import { Message } from "../constant/messages"
import { UserDTO } from "../dto/user.dto"
import webTokenService from "../utils/webToken.service"
import {Role} from '../constant/enum'
import HttpException from "../utils/HttpException.utils"
export class UserAuthController{

async create(req:Request, res:Response){
    const bodyRole =req.body?.role
    if(bodyRole === Role.SUDO_ADMIN)throw HttpException.forbidden(Message.notAuthorized)
    await userService.create(req.body as UserDTO)
    res.status(StatusCodes.CREATED).json({
        status:true,
        message:Message.created
    })

}
async getAll(req:Request,res:Response){

    const data = await userService.getAll()
    console.log(data)
    res.status(StatusCodes.SUCCESS).json({
        status:true,
        message:Message.fetched,
        data:data
    })
}

async login (req:Request, res:Response){
    const data = await authService.login(req.body)
    const tokens = webTokenService.generateTokens({

        id:data.id

    })
    res.status(StatusCodes.SUCCESS).json({
        data:{
            user:{
            id:data.id,
            email:data.email,
            details:{
                firstName:data.details.first_name,
                lastName:data.details.last_name,
                phoneNumber:data.details.phone_number
            },

        },
        tokens:{
            accessToken:tokens.accessToken,
            refreshToke:tokens.refreshToken,
        },
    },
        message:Message.loginSuccessfully,
    })
    
}
}