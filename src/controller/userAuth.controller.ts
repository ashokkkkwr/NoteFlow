import { StatusCodes } from "../constant/statusCodes"
import userService from "../services/user.service"
import { type Request,type Response } from "express"
import { Message } from "../constant/messages"
import { UserDTO } from "../dto/user.dto"
export class UserAuthController{

async create(req:Request, res:Response){
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
}