import { StatusCodes } from "../constant/statusCodes";
import { type Request, type Response } from "express";
import notesService from "../services/notes.service";
import { NotesDTO } from "../dto/notes.dto";
import { Message } from "../constant/messages";
import HttpException from "../utils/HttpException.utils";

export class NotesController {
async  create(req:Request,res:Response){

    const userId= req.user?.id
    console.log(req.user)
    console.log(userId, "userId")
    if(!userId){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status:false,
            message:'User not authenticated'
        });
    }
    const notesDTO:NotesDTO=req.body;
    try{
        await notesService.create(userId,notesDTO);
        res.status(StatusCodes.CREATED).json({
            status:true,
            message:Message.created
        });

    }catch(error:any){
        res.status(error.status|| StatusCodes.INTERNAL_SERVER_ERROR).json({
            status:false,
            message:error.message
        });
    }
} 
async  getOne(req:Request,res:Response){
    const userId = req.user?.id
    if(!userId){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status:false,
            message:"user not authenticated"
        })


    }
    try{
        const data = await notesService.getOne(userId);
        res.status(StatusCodes.SUCCESS).json({
            status:true,
            message:Message.fetched,
            data,
        })

    }catch(error:any){
        console.log(error)
        throw HttpException.badRequest(error.message)
    }

}
async getAll(req:Request,res:Response){
    const data  = await notesService.getAll();
    res.status(StatusCodes.SUCCESS).json({
        status:true,
        message:Message.fetched,
        data,
    })
    
}


}


export default new NotesController();
