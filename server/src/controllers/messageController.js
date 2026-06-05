const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");


const sendMessage = async (req, res) => {
  // console.log(req.body)
  try {
    const { content, chatId } = req.body;
      console.log(req.body)

    
    if (!content) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    if (!chatId) {
      return res.status(400).json({
        message: "Chat ID is required",
      });
    }
const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    // Check if current user is member of this chat
    const userInChat = chat.users.includes(req.user._id);
    if (!userInChat) {
      return res.status(403).json({
        message: "You are not a member of this chat",
      });
    }

    // CREATE MESSAGE
    const message = await Message.create({
      sender: req.user._id,      // Who sent this message
      content: content,          // What they sent
      chat: chatId,              // Which chat it belongs to
      readBy: [req.user._id],   // Sender has "read" their own message
    });


      console.log("EMITTING MESSAGE");
    console.log(chatId);

    //  io.to(chatId).emit("message_received", message);

    // POPULATE: Replace sender ID with full user object
    // Why: Client needs sender's username, avatar, etc.
    await message.populate("sender", "username avatar email");

    // UPDATE CHAT: Set latestMessage to this new message
    // Why: So chat list shows preview of latest message
    await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: message,
        // updatedAt automatically updates due to schema timestamps
      },
      { new: true } // Return updated documentals
    );

    // SOCKKET IO 
    const io = req.app.get("io")
    io.to(chatId).emit('message_received',message)
    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 50; // Default 50 messages

    // AUTHORIZATION: Check if user is member of this chat
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const userInChat = chat.users.includes(req.user._id);
    if (!userInChat) {
      return res.status(403).json({
        message: "You are not a member of this chat",
      });
    }

    // CALCULATE PAGINATION
    const skip = (page - 1) * limit;

    // QUERY: Get messages for this chat
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username avatar email") // Get sender details
      .sort({ createdAt: 1 }) // Newest first (for UI to reverse)
      .skip(skip)
      .limit(limit)
      .lean(); 
      messages.filter(msg =>msg!= null)
    // GET TOTAL COUNT: For client to know if more pages exist
    const totalMessages = await Message.countDocuments({ chat: chatId });

    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    // Check if user already read this message
    // $nin = "not in", so we find if user ID is NOT in readBy array
    const alreadyRead = message.readBy.includes(req.user._id);

    if (!alreadyRead) {
      // Add user to readBy array
      await Message.findByIdAndUpdate(
        messageId,
        {
          $push: { readBy: req.user._id }, // $push adds to array
        }
      );
    }

    res.json({ message: "Message marked as read" });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getAllMessages,
  markMessageAsRead,
};
