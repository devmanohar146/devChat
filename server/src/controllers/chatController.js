const Chat = require("../models/Chat");


// Create or Access One-to-One Chat
const accessChat = async (req, res) => {
  try {    
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        message: "UserId required",
      });
    }

    // Check existing chat
    let chat = await Chat.findOne({
      isGroupChat: false,

      users: {
        $all: [req.user._id, userId],
      },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) {
      return res.json(chat);
    }

    // Create new chat
    const newChat = await Chat.create({
      chatName: "private chat",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id)
      .populate("users", "-password");

    res.status(201).json(fullChat);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// Fetch all chats for logged-in user
const fetchChats = async (req, res) => {
  try {

    const chats = await Chat.find({
      users: {
        $elemMatch: {
          $eq: req.user._id,
        },
      },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username email avatar",
        },
      })
      .sort({ updatedAt: -1 });

    res.json(chats);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  accessChat,
  fetchChats,
};