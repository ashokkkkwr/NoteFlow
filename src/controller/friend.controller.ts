import { StatusCodes } from '../constant/statusCodes'
import HttpException from '../utils/HttpException.utils'
import { response, type Request, type Response } from 'express'
import { Message } from '../constant/messages'
import friendService from '../services/friend.service'

export class friendController {
  async addFriend(req: Request, res: Response) {
    const senderUserId = req.user?.id
    console.log(senderUserId)
    const receiverUserId = req.params.id
    const body = req.body
    try {
      const addFriend = await friendService.addFriend(senderUserId, receiverUserId)
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: Message.created,
        data: addFriend,
      })
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    }
  }

  async viewFriendRequest(req: Request, res: Response) {
    try {
      const receiverUserId = req.user?.id
      const friendRequests = await friendService.friendRequest(receiverUserId as string)

      res.status(StatusCodes.SUCCESS).json({
        data: friendRequests,
        status: true,
        message: Message.fetched,
      })
    } catch (error) {}
  }
  async viewNotification(req: Request, res: Response) {
    try {
      const receiverUserId = req.user?.id
      const friendRequests = await friendService.viewNotification(receiverUserId as string)

      res.status(StatusCodes.SUCCESS).json({
        data: friendRequests,
        status: true,
        message: Message.fetched,
      })
    } catch (error) {}
  }
  async markNotification(req: Request, res: Response) {
    try {
      const notificaitonId = req.params.id
      const friendRequests = await friendService.markNotification(notificaitonId as string)

      res.status(StatusCodes.SUCCESS).json({
        data: friendRequests,
        status: true,
        message: Message.fetched,
      })
    } catch (error) {}
  }

  async viewFriends(req: Request, res: Response) {
    try {
      console.log('jpt')
      const receiverUserId = req.user?.id
      const friendRequests = await friendService.viewFriends(receiverUserId as string)
      console.log(friendRequests)

      res.status(StatusCodes.SUCCESS).json({
        data: friendRequests,
        status: true,
        message: Message.fetched,
      })
    } catch (error) {}
  }
  async viewRequests(req: Request, res: Response) {
    try {
      console.log('jpt')
      const receiverUserId = req.user?.id
      const friendRequests = await friendService.viewRequest(receiverUserId as string)
      console.log(friendRequests)

      res.status(StatusCodes.SUCCESS).json({
        data: friendRequests,
        status: true,
        message: Message.fetched,
      })
    } catch (error) {}
  }
  async viewUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id
      const users = await friendService.viewUser(userId)

      res.status(StatusCodes.SUCCESS).json({
        data: users,
        status: true,
        message: Message.fetched,
      })
    } catch (error) {}
  }
  async acceptRequest(req: Request, res: Response) {
    try {
      const friendId = req.params.id
      const userId = req?.user?.id
      console.log(userId, 'userid')
      const acceptedRequests = await friendService.accepted(friendId, userId)
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: Message.updated,
        data: acceptedRequests,
      })
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    }
  }
  async deleteRequest(req: Request, res: Response) {
    try {
      const requestId = req.params.id
      const deleteRequest = await friendService.delete(requestId)
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: Message.updated,
        data: deleteRequest,
      })
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    }
  }
  async unfriend(req: Request, res: Response) {
    try {
      const requestId = req.params.id
      const deleteRequest = await friendService.deleteFriend(requestId)
      res.status(StatusCodes.SUCCESS).json({
        status: true,
        message: Message.deleted,
        data: deleteRequest,
      })
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.message,
      })
    }
  }
}
