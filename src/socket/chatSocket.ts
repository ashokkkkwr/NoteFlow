import { Server } from 'socket.io';
import chatService from '../services/chat.service';
import HttpException from '../utils/HttpException.utils';
import { Message } from '../constant/messages';
import { DotenvConfig } from '../config/env.config';
import webTokenService from '../utils/webToken.service';
import RoomService from '../services/room.service';
import userService from '../services/user.service';

export class ChatSocket {
  private userSockets = new Map();  // Map to track user ID to socket ID
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

    io.on('connection', async (socket) => {
      console.log(`User connected: ${socket.id}`);
      const userId = socket.data.user.id;
      this.userSockets.set(userId,socket.id)
      // Mark user as active when they connect
      try {
        await userService.active(userId);
        io.emit('statusChange', { userId, active: true }); // Notify all clients about the user's active status
        console.log(`User ${userId} marked as active`);
      } catch (error) {
        console.error('Error marking user as active:', error);
      }
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
  
     // Handle friend request and emit event to specific user
     socket.on('request', async (receiverId: string) => {
      const receiverSocketId = this.userSockets.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('notiReceiver', { receiverId });
        console.log(`Notification sent to user ${receiverId}`);
      } else {
        console.log('Receiver not connected');
      }
    });
      // Handle typing event
      socket.on('typing', async ({ receiverId }) => {
        console.log('User is typing');
        const roomService = new RoomService();
        const room = await roomService.findOrCreateIfNotExist([userId, receiverId]);
        if (room) {
          io.to(room.id).emit('typing', { userId });
        }
      });
      // Handle sending message
      socket.on('sendMessage', async ({ receiverId, content }) => {
        const roomService = new RoomService();
        const room = await roomService.findOrCreateIfNotExist([userId, receiverId]);
        console.log(room,"room ho lalalalalalalalallalalalala")

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

      socket.on('markMessagesAsRead', async ({ messageIds }) => {
        try {
          console.log(messageIds);
          const reads = await chatService.readMessages(messageIds);
          console.log(reads, "Messages marked as read");

          // Emit the messagesRead event to notify the client that these messages are marked as read
          io.to(socket.id).emit('messagesRead', { messageIds });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });
      socket.on('accepted', async ({ id, senderId }) => {
        try {
          console.log(id, "id ho la")
          console.log(senderId, "sender ko chai ID")
          const receiverDetails = await userService.getById(senderId)
          const senderDetails = await userService.getById(userId)
          // console.log(senderDetails,'sender Details')
          // console.log(receiverDetails,"receiver Details")

          io.to(userId).emit('accept', { receiverDetails, senderDetails })

        } catch (error) {
          console.log("error haha", error)
        }
      })

      

      // Handle disconnect
      socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.id}`);
        try {
          await userService.offline(userId); // Update user's status to offline
          io.emit('statusChange', { userId, active: false }); // Notify all clients about the user's offline status
          console.log(`User ${userId} marked as offline`);
        } catch (error) {
          console.error('Error marking user as offline:', error);
        }
      });


    });
  }
}
