import {Server} from 'socket.io';
import chatService from '../services/chat.service';
import HttpException from '../utils/HttpException.utils';
import {Message} from '../constant/messages';
import {DotenvConfig} from '../config/env.config';
import webTokenService from '../utils/webToken.service';
import RoomService from '../services/room.service';
import userService from '../services/user.service';
import friendService from '../services/friend.service';
import {get} from 'http';

export class ChatSocket {
  private userSockets = new Map(); // Map to track user ID to socket ID
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
      const userId = socket.data.user.id;
      this.userSockets.set(userId, socket.id);
      // Mark user as active when they connect
      try {
        await userService.active(userId);
        io.emit('statusChange', {userId, active: true}); // Notify all clients about the user's active status
      } catch (error) {
        console.error('Error marking user as active:', error);
      }
      // Handle joining rooms
      socket.on('joinRoom', async ({receiverId}) => {
        const roomService = new RoomService();
        const room = await roomService.findOrCreateIfNotExist([userId, receiverId]);
        console.log('🚀 ~ ChatSocket ~ socket.on ~ room:', room);
        if (room) {
          // Leave any other room the user might have joined previously
          const currentRooms = Array.from(socket.rooms);
          currentRooms.forEach((roomId) => {
            if (roomId !== socket.id) {
              // socket.id is the default room, don't leave it
              socket.leave(roomId);
            }
          });
          socket.join(room.id);
        } else {
          console.error('Room creation or retrieval failed');
        }
      });
      // Handle friend request and emit event to specific user
      socket.on('request', async (receiverId: string) => {
        const sendFriendRequest = await friendService.addFriend(userId, receiverId);
        const receiverDetails = await userService.getById(receiverId);
        const senderDetails = await userService.getById(userId);
        const notiService = await friendService.addNotification(userId, receiverId);
        const receiverSocketId = this.userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('notiReceiver', {receiverId, senderDetails, notiService});
        } else {
          console.log('Receiver not connected');
        }
      });
      socket.on('markAsRead', async (notificationId) => {
        const markRead = friendService.markNotification(notificationId);
      });
      // Handle typing event
      socket.on('typing', async ({receiverId}) => {
        const roomService = new RoomService();
        const room = await roomService.findOrCreateIfNotExist([userId, receiverId]);
        if (room) {
          io.to(room.id).emit('typing', {userId});
        }
      });
      socket.on('sendMessage', async ({receiverId, content}) => {
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
            try {
              const unreadCount = await chatService.getUnreadCounts(receiverId,userId)
              const receiverSocketId = this.userSockets.get(receiverId);
              if (receiverSocketId) {
                io.to(receiverSocketId).emit('unreadCounts', {receiverId:senderDetails.id, unreadCount:unreadCount});
              }
              // io.to(userId).emit('unreadCounts',{
              //   receiverId:receiverId,
              //   unreadCount:unreadCount
              // })
            } catch (error) {
              console.log("🚀 ~ ChatSocket ~ socket.on ~ error:", error) 
            }
          } catch (error) {
            console.error('Error sending message:', error);
          }
        } else {
          console.error('Room creation or retrieval failed');
        }
      });
      socket.on('readed', async ({receiverId}) => {
        try {
          const reads = await chatService.readMessages(userId, receiverId);
          console.log("🚀zcshf ~ ChatSocket ~ socket.on ~ userId:", userId)
          
          const unreadCount = await chatService.getUnreadCounts(userId, receiverId);
          console.log('🚀 ~ ChatSocket ~ socket.on ~ reads:', reads);

          // io.to(userId).emit('read', {receiverId, unreadCount})
          // if (userSocketID) {
          //   io.to(userSocketID).emit('read', {receiverId, unreadCount});
          // }
          const receiverSocketId = this.userSockets.get(userId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('read', {receiverId, unreadCount});
          } else {
            console.log('Receiver not connected');
          }
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      });
      socket.on('accepted', async ({id, senderId}) => {
        try {
          console.log(id, 'id ho la');
          console.log(senderId, 'sender ko chai ID');
          const receiverDetails = await userService.getById(senderId);
          const senderDetails = await userService.getById(userId);
          // console.log(senderDetails,'sender Details')
          // console.log(receiverDetails,"receiver Details")
          io.to(userId).emit('accept', {receiverDetails, senderDetails});
        } catch (error) {
          console.log('error haha', error);
        }
      });
      // Handle disconnect
      socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.id}`);
        try {
          await userService.offline(userId); // Update user's status to offline
          io.emit('statusChange', {userId, active: false}); // Notify all clients about the user's offline status
          console.log(`User ${userId} marked as offline`);
        } catch (error) {
          console.error('Error marking user as offline:', error);
        }
      });
    });
  }
}
