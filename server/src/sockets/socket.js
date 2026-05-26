const socketHandler =(io)=>{
    io.on("connection",(socket)=>{
        console.log("socket connected")

        socket.on("setup",(userData)=>{
            console.log("User setup",userData)
            socket.join(userData._id);
            socket.emit("connected")
        })
        socket.on("join_chat",(chatId)=>{
            socket.join(chatId)
            console.log("joined the chat", chatId)
        })
        socket.on("typing",(chatId)=>{
            socket.to(chatId).emit("typing")
        })
        socket.on("stop_typing",(chatId)=>{
            socket.to(chatId).emit("stop_typing")
        })

        socket.on("disconnect",()=>{
            console.log("Socket disconnected:",socket.id)
        })
    })
}

module.exports = socketHandler;