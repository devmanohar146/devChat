const Message = require("../models/Message");
const Chat = require("../models/Chat");
const User = require("../models/User");

/**
 * SEND MESSAGE
 * 
 * Request Flow:
 * 1. User provides content and chatId
 * 2. Middleware has already verified JWT and attached req.user
 * 3. Controller validates inputs
 * 4. Creates message in DB with sender = req.user._id
 * 5. Updates Chat document with latestMessage reference
 * 6. Populates message with sender details
 * 7. Returns message to client
 * 8. Later: Socket.IO will emit real-time event
 * 
 * Why separate message from chat?
 * - Messages are transactional (can be 10,000 per chat)
 * - Chat stores reference to latest message only
 * - Keeps chat document small (not bloated with array of messages)
 * - Allows pagination and efficient queries
 */
const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    // VALIDATION: Check if required fields exist
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

    // AUTHORIZATION CHECK: Verify user is member of this chat
    // Security principle: Don't let user send message to chat they're not in
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

    // POPULATE: Replace sender ID with full user object
    // Why: Client needs sender's username, avatar, etc.
    await message.populate("sender", "username avatar email");

    // UPDATE CHAT: Set latestMessage to this new message
    // Why: So chat list shows preview of latest message
    await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: message._id,
        // updatedAt automatically updates due to schema timestamps
      },
      { new: true } // Return updated document
    );

    // SOCKKET IO 
    const io = req.app.get("io")
    io.to(chatId).emit('mesage_recived',fullMessage)

    res.status(201).json(message);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET ALL MESSAGES IN A CHAT
 * 
 * Request Flow:
 * 1. User requests messages from a specific chat
 * 2. Include pagination: page and limit
 * 3. Verify user is member of chat
 * 4. Query messages, populate senders
 * 5. Sort by date (newest first for UI reversal)
 * 6. Apply pagination
 * 7. Return array
 * 
 * Pagination is critical:
 * - Chat with 100,000 messages? Don't load all!
 * - Load 50 at a time, user scrolls up to load older
 * - This is called "infinite scroll"
 * 
 * Formula:
 * skip = (page - 1) * limit
 * Example: page=2, limit=50 → skip 50, get next 50
 */
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
      .sort({ createdAt: -1 }) // Newest first (for UI to reverse)
      .skip(skip)
      .limit(limit)
      .lean(); // .lean() returns plain JS objects (faster, read-only)

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

/**
 * MARK MESSAGE AS READ
 * 
 * When user reads messages in a chat:
 * 1. Add user to readBy array (only once)
 * 2. This prevents duplicate reads
 * 
 * Later: Show read receipts (✓✓) in UI
 */
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
