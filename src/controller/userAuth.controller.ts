import { StatusCodes } from "../constant/statusCodes"
import userService from "../services/user.service"
import { type Request,type Response } from "express"
import { Message } from "../constant/messages"
export class UserAuthController{

async create(req:Request, res:Response){
    await userService.create(req.body)
    res.status(StatusCodes.CREATED).json({
        status:true,
        message:Message.created
    })

}
}