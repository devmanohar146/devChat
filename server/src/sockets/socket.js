const User = require("../models/User.js")


const socketHandler =(io)=>{
    io.on("connection",(socket)=>{
 
        socket.on("setup",(userData)=>{
            const userId = userData._id
            socket.join(userId);
            User.findByIdAndUpdate(userId, { isOnline: true })
            socket.emit("connected")

             socket.on("disconnect",async ()=>{
            await User.findByIdAndUpdate(userId,{
                isOnline:false,
                lastSeen: new Date()
            })
            console.log("Socket disconnected:",socket.id)
        })
        })

        socket.on("message_received", (message) => {
        setMessages(prev => [...prev, message]);
        });

        socket.on("join_chat",(chatId)=>{
            socket.join(chatId)
            // console.log("joined the chat", chatId)
        })
        socket.on("typing",({chatId,user})=>{
            // console.log(user,chatId)
            socket.to(chatId).emit("typing",user)
        })
        socket.on("stop_typing",(chatId)=>{
            socket.to(chatId).emit("stop_typing")
        })

       
    })
}

module.exports = socketHandler;