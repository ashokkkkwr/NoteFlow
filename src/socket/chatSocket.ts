import {Server} from 'socket.io'
import chatService from '../services/chat.service'
export class ChatSocket{
    async setupSocket(server:any){
        const io=new Server(server,{
            cors:{
                origin:'*',
            },
        })
        io.on('connection',(socket)=>{
            console.log(`use connected ${socket.id}`)
            socket.on('sendMessage',async(data)=>{
                const{senderId,receiverId,message}=data;
                const chatMessage=await chatService.sendMessage(senderId,receiverId,message);
                io.emit('receiveMessage',chatMessage);
            })
            socket.on('disconnect',()=>{
                console.log(`user Disconnected. ${socket.id}`)
            })
        })
    
    }
}
