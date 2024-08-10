import { Server } from 'socket.io';
import chatService from '../services/chat.service';
import HttpException from '../utils/HttpException.utils';
import { Message } from '../constant/messages';
import { DotenvConfig } from '../config/env.config';
import webTokenService from '../utils/webToken.service';
import RoomService from '../services/room.service';
import userService from '../services/user.service'

export class ChatSocket {
  async setupSocket(server: any) {
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(HttpException.unauthorized(Message.notAuthorized));
      }
      try {
        const payload = webTokenService.verify(token, DotenvConfig.ACCESS_TOKEN_SECRET);
        if (payload) {
          socket.data.user = payload;
          next();
        } else {
          return next(HttpException.unauthorized(Message.notAuthorized));
        }
      } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
          return next(HttpException.unauthorized(Message.tokenExpired));
        } else {
          return next(HttpException.unauthorized(Message.notAuthorized));
        }
      }
    });

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
      const userId = socket.data.user.id;

      // Handle joining rooms
      socket.on('joinRoom', async ({ receiverId }) => {
        const roomService = new RoomService();
        const room = await roomService.findOrCreateIfNotExist([userId, receiverId]);

        if (room) {
           // Leave any other room the user might have joined previously
      const currentRooms = Array.from(socket.rooms);
      currentRooms.forEach(roomId => {
        if (roomId !== socket.id) {  // socket.id is the default room, don't leave it
          socket.leave(roomId);
        }
      });
          socket.join(room.id);
          console.log(`User ${userId} joined room ${room.id}`);
        } else {
          console.error('Room creation or retrieval failed');
        }
      });
       
      socket.on('typing',async ({receiverId})=>{
        console.log('typing')
        const roomService = new RoomService();
        const room = await roomService.findOrCreateIfNotExist([userId, receiverId]);
        if(room){
          io.to(room.id).emit('typing',{userId})
        }
      
      })
      socket.on('sendMessage', async ({ receiverId, content }) => {
        const roomService = new RoomService();
        const room = await roomService.findOrCreateIfNotExist([userId, receiverId]);
    
        if (room) {
            try {
                const message = await chatService.sendMessage(userId, receiverId, content, room.id);
    
                const senderDetails = await userService.getById(userId);
                const receiverDetails = await userService.getById(receiverId);

                // Attach sender and receiver details to the message
                const enrichedMessage = {
                    ...message,
                    sender: {
                        details: {
                            first_name: senderDetails.details.first_name,
                            profileImage: senderDetails.details.profileImage,
                        },
                    },
                    receiver: {
                        details: {
                            first_name: receiverDetails.details.first_name,
                            profileImage: receiverDetails.details.profileImage,
                        },
                    },
                };
    
                io.to(room.id).emit('message', enrichedMessage);
                console.log(`Message sent from ${userId} to ${receiverId}`);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        } else {
            console.error('Room creation or retrieval failed');
        }
    });
    
      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
}
