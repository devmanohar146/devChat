const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const {
  sendMessage,
  getAllMessages,
  markMessageAsRead,
} = require("../controllers/messageController");

const router = express.Router();

/**
 * POST /api/message
 * Send a new message to a chat
 * 
 * Request body:
 * {
 *   content: "Hello!",
 *   chatId: "6a0edccf9ea4cc0dc1885850"
 * }
 * 
 * Why protect middleware first?
 * - Ensures only authenticated users can send messages
 * - Middleware loads req.user before controller runs
 * - Controller then verifies user is in chat (double-check)
 * 
 * Status codes:
 * 201 = Created (new resource made)
 * 400 = Bad request (missing fields)
 * 403 = Forbidden (not in chat)
 * 404 = Not found (chat doesn't exist)
 */
router.post("/", protect, sendMessage);

/**
 * GET /api/message/:chatId
 * Get all messages from a chat with pagination
 * 
 * Query parameters:
 * ?page=1&limit=50
 * 
 * Response:
 * {
 *   messages: [...],
 *   currentPage: 1,
 *   totalPages: 5,
 *   totalMessages: 250
 * }
 * 
 * Why pagination?
 * - Loading 10,000 messages at once = memory overload
 * - Client UI can't render 10,000 DOM elements efficiently
 * - Use "infinite scroll": load 50, scroll up loads previous 50
 */
router.get("/:chatId", protect, getAllMessages);

/**
 * PUT /api/message/:messageId/read
 * Mark a message as read by current user
 * 
 * This adds current user to message's readBy array
 * Later: UI shows read receipt (✓✓)
 */
router.put("/:messageId/read", protect, markMessageAsRead);

module.exports = router;
