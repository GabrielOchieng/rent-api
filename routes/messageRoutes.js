import express from "express";

import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  createMessage,
  getMessage,
  markMessageAsRead,
} from "../controllers/messageController.js";

const router = express.Router();

// Create a new conversation
router.post("/", createMessage);

// Get conversations for a user
router.get("/:conversationId", getMessage);

// Mark a message as read
// router.put("/:messageId/read", protect, markMessageAsRead);
router.put("/:messageId/mark-as-read", markMessageAsRead);

export default router;
