const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // null for guest messages
    },
    content: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    intent: {
      type: String,
      enum: ['BLOOD_KNOWLEDGE', 'CRM_DONATION_HISTORY', 'CRM_APPOINTMENTS', 'CRM_REWARDS', 'CRM_PROFILE', 'CRM_BLOOD_BANKS', 'EMERGENCY_ASSISTANCE', 'UNKNOWN'],
      default: 'UNKNOWN'
    },
    isGuest: {
      type: Boolean,
      default: false
    },
    sessionId: {
      type: String,
      default: null // For tracking guest sessions
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
chatMessageSchema.index({ userId: 1, createdAt: -1 });
chatMessageSchema.index({ sessionId: 1, createdAt: -1 });
chatMessageSchema.index({ createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
