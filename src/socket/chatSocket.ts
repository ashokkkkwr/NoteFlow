import { Server } from 'socket.io'
import chatService from '../services/chat.service'
import HttpException from '../utils/HttpException.utils'
import { Message } from '../constant/messages'
import { DotenvConfig } from '../config/env.config'
import webTokenService from '../utils/webToken.service'
import userService from '../services/user.service'

export class ChatSocket {
  async setupSocket(server: any) {
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    })
    // Middleware to authenticate Socket.io connections
    // singleton architecture
    io.use((socket, next) => {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(HttpException.unauthorized(Message.notAuthorized))
      }
      try {
        const payload = webTokenService.verify(token, DotenvConfig.ACCESS_TOKEN_SECRET)
        if (payload) {
          socket.data.user = payload
          next()
        } else {
          return next(HttpException.unauthorized(Message.notAuthorized))
        }
      } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
          return next(HttpException.unauthorized(Message.tokenExpired))
        } else {
          return next(HttpException.unauthorized(Message.notAuthorized))
        }
      }
    })
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`)
      const userId = socket.data.user.id
      socket.join(userId)
      socket.on('sendMessage', async (data) => {
        const content = data.content
        const receiverId = data.receiverId
        console.log(receiverId,'receiverId')
        try {
          const sender = await userService.getById(userId)
          const chatMessage = await chatService.sendMessage(userId, receiverId, content)
          const fullMessage = {
            ...chatMessage,
            sender: {
              details: {
                first_name: sender.details.first_name,
                profileImage: sender.details.profileImage
              }
            },
            receiver: {
              details: {
                profileImage: data.receiverProfileImage,

              }
            }
          }

          //// room vanne table banau   user 1, user 2  second ra third column id, 

          io.to(receiverId).emit('receiveMessage', fullMessage)
          socket.to(receiverId).emit('messageNotification', {
            senderId: userId,
            content,
            senderProfileImage: sender.details.profileImage[0]?.path,
            senderFirstName: sender.details.first_name
          })
        } catch (error) {
          console.error('Error sending message:', error)
        }
      })
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`)
      })
    })
  }
}

