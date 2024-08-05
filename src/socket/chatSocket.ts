import { Server } from 'socket.io'
import chatService from '../services/chat.service'
import HttpException from '../utils/HttpException.utils'
import { Message } from '../constant/messages'
import { DotenvConfig } from '../config/env.config'
import webTokenService from '../utils/webToken.service'

export class ChatSocket {
  async setupSocket(server: any) {
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    })

    // Middleware to authenticate Socket.io connections
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

      // Join a room based on userId for direct messaging
      socket.join(userId)

      socket.on('sendMessage', async (data) => {
        const { receiverId, content } = data
        try {
          const chatMessage = await chatService.sendMessage(userId, receiverId, content)
          io.to(receiverId).emit('receiveMessage', chatMessage)
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
