const User = require("../models/User.js");

const socketHandler = (io) => {
  io.on("connection", (socket) => {

    socket.on("setup", async (userData) => {
      socket.userId = userData._id;

      socket.join(socket.userId);

      await User.findByIdAndUpdate(socket.userId, {
        isOnline: true,
      });

     io.emit("user_online", socket.userId);
      socket.emit("connected");
    });

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("message_received", (message) => {
      const chatId = message.chat._id;

      socket.to(chatId).emit("message_received", message);
    });

    socket.on("typing", ({ chatId, user }) => {
      socket.to(chatId).emit("typing", user);
    });

    socket.on("stop_typing", (chatId) => {
      socket.to(chatId).emit("stop_typing");
    });

    socket.on("disconnect", async () => {
      if (!socket.userId) return;
      
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      io.emit("user_offline",{
        userId:socket.userId,
        lastSeen:new Date()
      })

      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;