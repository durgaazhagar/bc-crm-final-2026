/**
 * CHATBOT ROUTES
 * Endpoints for AI chatbot conversation and chat history
 */

const express = require('express');
const auth = require('../middleware/auth');
const chatbotService = require('../services/chatbot');
const ChatMessage = require('../models/ChatMessage');

const router = express.Router();
const chatController = require('../controllers/chatController');

/**
 * POST /api/chat/message
 * Process user message through chatbot
 * Body: { message, chatHistory, sessionId }
 * Headers: Authorization: Bearer <token>
 */
router.post('/message', auth, async (req, res) => {
  try {
    const { message, chatHistory = [], sessionId } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        data: null,
        explanation: 'Message cannot be empty'
      });
    }

    // Save user message
    await ChatMessage.create({
      userId,
      content: message,
      role: 'user',
      isGuest: false,
      sessionId
    });

    // Process the message through chatbot
    const result = await chatbotService.processMessage(message, userId, chatHistory);

    // Save assistant response
    await ChatMessage.create({
      userId,
      content: result.conversational,
      role: 'assistant',
      intent: result.intent,
      isGuest: false,
      sessionId
    });

    res.json({
      status: 'success',
      data: {
        response: result.conversational,
        intent: result.intent,
        timestamp: new Date().toISOString()
      },
      explanation: `Response generated for intent: ${result.intent}`
    });
  } catch (error) {
    console.error('Chat Message Error:', error);
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message || 'Failed to process message'
    });
  }
});

/**
 * POST /api/chat
 * Optional public endpoint that forwards to Anthropic-backed chat controller.
 * Body: { message, sessionId }
 */
router.post('/', async (req, res) => {
  return chatController.handleChat(req, res);
});

/**
 * POST /api/chat/guest/message
 * Process guest user message through chatbot (no auth required)
 * Body: { message, chatHistory, sessionId }
 */
router.post('/guest/message', async (req, res) => {
  try {
    const { message, chatHistory = [], sessionId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        data: null,
        explanation: 'Message cannot be empty'
      });
    }

    // Save guest message
    if (sessionId) {
      await ChatMessage.create({
        content: message,
        role: 'user',
        isGuest: true,
        sessionId
      });
    }

    // Process the message through chatbot (no userId for guests)
    const result = await chatbotService.processMessage(message, null, chatHistory);

    // Save guest assistant response
    if (sessionId) {
      await ChatMessage.create({
        content: result.conversational,
        role: 'assistant',
        intent: result.intent,
        isGuest: true,
        sessionId
      });
    }

    res.json({
      status: 'success',
      data: {
        response: result.conversational,
        intent: result.intent,
        timestamp: new Date().toISOString()
      },
      explanation: `Response generated for intent: ${result.intent}`
    });
  } catch (error) {
    console.error('Guest Chat Message Error:', error);
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message || 'Failed to process message'
    });
  }
});

/**
 * GET /api/chat/history
 * Get chat history for authenticated user
 * Query: ?limit=50&skip=0
 */
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const messages = await ChatMessage.find({ userId, isGuest: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select('content role intent createdAt');

    const total = await ChatMessage.countDocuments({ userId, isGuest: false });

    res.json({
      status: 'success',
      data: {
        messages: messages.reverse(),
        total,
        limit,
        skip
      },
      explanation: 'Chat history retrieved'
    });
  } catch (error) {
    console.error('Chat History Error:', error);
    res.status(500).json({
      status: 'error',
      data: null,
      explanation: error.message || 'Failed to retrieve chat history'
    });
  }
});

/**
 * GET /api/chat/info
 * Get chatbot information and capabilities
 */
router.get('/info', (req, res) => {
  res.json({
    status: 'success',
    data: {
      name: 'BloodConnect CRM AI Assistant',
      version: '2.0',
      capabilities: [
        'Answer blood donation questions',
        'Provide blood compatibility information',
        'Explain donation eligibility',
        'Inform about donation intervals and requirements',
        'Discuss health conditions and blood donation',
        'Provide emergency assistance information',
        "Access donor's CRM data (authenticated users)"
      ],
      topics: [
        'Blood Groups (A+, B+, O+, AB+, etc.)',
        'Blood Compatibility',
        'Donation Eligibility',
        'Donation Intervals',
        'Hemoglobin Requirements',
        'Health Conditions & Blood Donation',
        'Blood Banks & Donation Centers',
        'Emergency Blood Requests',
        'Platelet Donation',
        'Plasma Donation',
        'Donation Benefits & Risks',
        'Donor Rewards & Achievements',
        'Appointment Booking'
      ]
    },
    explanation: 'Chatbot information retrieved'
  });
});

module.exports = router;
