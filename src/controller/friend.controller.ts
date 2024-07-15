import { StatusCodes } from "../constant/statusCodes";
import HttpException from "../utils/HttpException.utils";
import {response, type Request, type Response} from 'express'
import {Message} from '../constant/messages'
import friendService from "../services/friend.service";


export class friendController {
    async addFriend(req:Request, res:Response) {
        const senderUserId=req.user?.id;
        console.log(senderUserId)
        const receiverUserId=req.params.id
        const body = req.body
        try{
        const addFriend = await friendService.addFriend(senderUserId,receiverUserId,body)
        res.status(StatusCodes.SUCCESS).json({
            status: true,
            message: Message.created,
            data: addFriend,
          })
        }
        catch(error:any){
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status:false,
            message:error.message,
          })
        }
      }


      async viewFriendRequest(req:Request,res:Response){
        try{
          const receiverUserId=req.user?.id;
          const friendRequests =  await friendService.friendRequest(receiverUserId as string)
          console.log(friendRequests)
 
        }catch(error){

        }
      }
      async acceptRequest(req:Request,res:Response){
        try{
          const friendId=req.params.id
          const acceptedRequests = await friendService.accepted(friendId)
         res.send("ok")

        }catch(error){

        }
      }
    }
   


