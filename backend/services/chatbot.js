/**
 * AI CHATBOT SERVICE
 * Intelligent medical assistant for blood donation questions
 * Supports intent detection: CRM Actions, Blood Donation Knowledge, Emergency Assistance
 */

const { OpenAI } = require('openai');
const Donor = require('../models/Donor');
const User = require('../models/User');
const Emergency = require('../models/Emergency');

const openaiApiKey = process.env.OPENAI_API_KEY;
const hasValidOpenAIKey = typeof openaiApiKey === 'string'
  && openaiApiKey.trim().length > 0
  && !/YOUR_|sk-your|example|dummy/i.test(openaiApiKey);

const client = hasValidOpenAIKey
  ? new OpenAI({ apiKey: openaiApiKey })
  : {
      messages: {
        create: async () => {
          throw new Error('OpenAI API key not configured');
        }
      }
    };

// Blood donation knowledge base
const BLOOD_KNOWLEDGE_BASE = {
  bloodGroups: {
    'A+': { canDonate: ['A+', 'AB+'], canReceive: ['A+', 'A-', 'O+', 'O-'], donors: 'A+, O+, A-, O-' },
    'A-': { canDonate: ['A+', 'A-', 'AB+', 'AB-'], canReceive: ['A-', 'O-'], donors: 'A-, O-' },
    'B+': { canDonate: ['B+', 'AB+'], canReceive: ['B+', 'B-', 'O+', 'O-'], donors: 'B+, O+, B-, O-' },
    'B-': { canDonate: ['B+', 'B-', 'AB+', 'AB-'], canReceive: ['B-', 'O-'], donors: 'B-, O-' },
    'AB+': { canDonate: ['AB+'], canReceive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'], donors: 'All blood types' },
    'AB-': { canDonate: ['AB+', 'AB-'], canReceive: ['A-', 'B-', 'AB-', 'O-'], donors: 'A-, B-, AB-, O-' },
    'O+': { canDonate: ['A+', 'B+', 'AB+', 'O+'], canReceive: ['O+', 'O-'], donors: 'O+, O-' },
    'O-': { canDonate: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canReceive: ['O-'], donors: 'O-' }
  },
  eligibility: {
    age: '18-65 years old',
    weight: 'At least 50 kg (110 lbs)',
    hemoglobin: 'Men: 13.5-17.5 g/dL, Women: 12.5-15.5 g/dL',
    health: 'Good overall health, no active infections',
    medications: 'Some medications may disqualify - check with doctor'
  },
  intervals: {
    wholeBood: '56 days (8 weeks) between donations',
    platelets: 'Every 2-3 days (up to 24 times per year)',
    plasma: '28 days (4 weeks) between donations',
    redCells: '112 days (16 weeks) between donations'
  },
  benefits: [
    'Free health screening and blood work',
    'Reduce risk of heart disease and cancer',
    'Replenish iron levels naturally',
    'Save up to 3 lives per donation',
    'Feel the satisfaction of helping others',
    'May receive rewards or incentives'
  ],
  risks: [
    'Temporary lightheadedness or dizziness',
    'Minor bruising at needle site',
    'Rare allergic reactions',
    'Extremely rare transmission of infections (screened)',
    'Dehydration (preventable by hydrating before/after)'
  ],
  conditions: {
    canNotDonate: [
      'HIV or AIDS',
      'Hepatitis B or C',
      'Recent tattoo or piercing (12 months)',
      'Recent surgery (varies by type)',
      'Current infections or fever',
      'Anemia or low hemoglobin',
      'Severe blood pressure issues',
      'Recent travel to malaria regions'
    ],
    canDonateWithRestrictions: [
      'Diabetes (if well-controlled)',
      'High blood pressure (if treated)',
      'Thyroid disease (if treated)',
      'Asthma (if controlled)',
      'Migraine history'
    ]
  }
};

// CRM action keywords
const CRM_ACTION_KEYWORDS = {
  donationHistory: ['my donations', 'donation history', 'how many times', 'how often', 'my records', 'my donations'],
  appointments: ['book appointment', 'schedule', 'appointment', 'booking', 'when can i', 'when to donate'],
  rewards: ['rewards', 'points', 'incentives', 'badges', 'achievements', 'my points'],
  profile: ['my profile', 'my details', 'my information', 'update profile', 'edit profile'],
  bloodBanks: ['blood bank', 'nearest bank', 'hospital', 'donation center', 'where to donate']
};

const EMERGENCY_KEYWORDS = ['emergency', 'urgent', 'critical', 'blood needed', 'STAT', 'needed immediately', 'life-threatening'];

class ChatbotService {
  /**
   * Detect user intent from message
   */
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();

    // Check for emergency
    if (EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
      return 'EMERGENCY_ASSISTANCE';
    }

    // Check for CRM actions
    for (const [action, keywords] of Object.entries(CRM_ACTION_KEYWORDS)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return `CRM_${action.toUpperCase()}`;
      }
    }

    // Default to knowledge question
    return 'BLOOD_KNOWLEDGE';
  }

  /**
   * Execute CRM actions based on intent
   */
  async executeCRMAction(intent, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return null;

      const donor = await Donor.findOne({ userId });
      if (!donor) return null;

      switch (intent) {
        case 'CRM_DONATION_HISTORY':
          return {
            type: 'DONATION_HISTORY',
            data: {
              totalDonations: donor.donations,
              lastDonation: donor.lastDonationDate,
              bloodType: donor.bloodType,
              lifesSaved: donor.donations * 3
            }
          };

        case 'CRM_APPOINTMENTS':
          return {
            type: 'APPOINTMENTS_INFO',
            data: {
              canDonateAgain: donor.canDonateAgain,
              nextEligibleDate: this.calculateNextEligibleDate(donor.lastDonationDate),
              message: 'You can book an appointment at your nearest blood bank.'
            }
          };

        case 'CRM_REWARDS':
          return {
            type: 'REWARDS_INFO',
            data: {
              points: donor.rewardPoints || 0,
              badges: donor.badges || [],
              message: 'Check your rewards dashboard for current incentives!'
            }
          };

        case 'CRM_PROFILE':
          return {
            type: 'PROFILE_INFO',
            data: {
              name: donor.name,
              bloodType: donor.bloodType,
              contact: donor.contact,
              location: donor.location
            }
          };

        case 'CRM_BLOOD_BANKS':
          return {
            type: 'BLOOD_BANKS_INFO',
            data: {
              message: 'Blood banks near you or visit our Blood Bank Locator page for locations.'
            }
          };

        default:
          return null;
      }
    } catch (error) {
      console.error('CRM Action Error:', error);
      return null;
    }
  }

  /**
   * Generate knowledge-based response using AI
   */
  async generateKnowledgeResponse(message, chatHistory = []) {
    try {
      // Build context with blood knowledge
      const knowledgeContext = `
You are BloodConnect, a compassionate AI medical assistant specializing in blood donation information.

BLOOD DONATION KNOWLEDGE BASE:
${JSON.stringify(BLOOD_KNOWLEDGE_BASE, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Always provide accurate, medically verified information
2. Be conversational and warm, not robotic
3. Answer questions about: blood groups, compatibility, donation eligibility, intervals, hemoglobin, health conditions, blood banks, emergency requests, platelet/plasma donation, benefits/risks
    4. If the model cannot provide a full answer, ask one clarifying question and offer general guidance.
6. Maintain context from previous messages in the conversation
7. Keep responses concise but helpful (2-3 sentences typically)
8. Always be encouraging and supportive about blood donation`;

      // Prepare messages for Claude
      const messages = [
        {
          role: 'user',
          content: knowledgeContext
        },
        ...chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: knowledgeContext,
        messages: messages.slice(1) // Remove the system knowledge from messages array
      });

      const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

      return {
        type: 'AI_RESPONSE',
          message: responseText || 'Temporary AI service issue; please try rephrasing your question.',
        source: 'knowledge_base'
      };
    } catch (error) {
      console.error('AI Generation Error:', error);
      return {
        type: 'AI_RESPONSE',
          message: 'Temporary AI generation error; please try again.',
        source: 'fallback',
        error: error.message
      };
    }
  }

  /**
   * Generate emergency assistance response
   */
  async generateEmergencyResponse(message) {
    try {
      const emergencyPrompt = `
You are BloodConnect emergency assistant. The user may be inquiring about or reporting an emergency blood situation.

${message}

Provide compassionate, immediate guidance. If this is an actual emergency, emphasize contacting emergency services.
Keep response brief and action-oriented.`;

      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: emergencyPrompt
          }
        ]
      });

      const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

      return {
        type: 'EMERGENCY_RESPONSE',
        message: responseText,
        source: 'emergency_handler'
      };
    } catch (error) {
      console.error('Emergency Response Error:', error);
      return {
        type: 'EMERGENCY_RESPONSE',
        message: 'If this is a medical emergency, please call emergency services (911 in the US) or go to the nearest hospital immediately.',
        source: 'fallback'
      };
    }
  }

  /**
   * Process user message and generate appropriate response
   */
  async processMessage(message, userId, chatHistory = []) {
    try {
      // Detect intent
      const intent = this.detectIntent(message);

      // Route based on intent
      if (intent.startsWith('CRM_')) {
        const crmResult = await this.executeCRMAction(intent, userId);
        if (crmResult) {
          return {
            status: 'success',
            intent,
            response: crmResult,
            conversational: this.formatCRMResponseConversational(crmResult)
          };
        }
      } else if (intent === 'EMERGENCY_ASSISTANCE') {
        const emergencyResult = await this.generateEmergencyResponse(message);
        return {
          status: 'success',
          intent,
          response: emergencyResult,
          conversational: emergencyResult.message
        };
      }

      // Default: Blood donation knowledge question
      const knowledgeResult = await this.generateKnowledgeResponse(message, chatHistory);
      return {
        status: 'success',
        intent: 'BLOOD_KNOWLEDGE',
        response: knowledgeResult,
        conversational: knowledgeResult.message
      };
    } catch (error) {
      console.error('Message Processing Error:', error);
      return {
          status: 'error',
          intent: 'UNKNOWN',
          response: {
              message: 'Unable to process the request at this time; please try again.',
            source: 'fallback'
          },
          error: error.message
        };
    }
  }

  /**
   * Format CRM response in conversational way
   */
  formatCRMResponseConversational(crmResult) {
    const { type, data } = crmResult;

    switch (type) {
      case 'DONATION_HISTORY':
        return `You've made ${data.totalDonations} donations so far! 🎉 That's amazing - you've potentially saved ${data.lifesSaved} lives. Your last donation was on ${new Date(data.lastDonation).toLocaleDateString()}. Thank you for being such a dedicated donor!`;

      case 'APPOINTMENTS_INFO':
        const nextDate = new Date(data.nextEligibleDate).toLocaleDateString();
        return `Great! You'll be eligible to donate again on ${nextDate}. You can book an appointment at your nearest blood bank through our app. Would you like help finding a donation center near you?`;

      case 'REWARDS_INFO':
        return `You have ${data.points} reward points! 🏆 You've earned some great badges too. Check your dashboard to see what you can redeem with your points.`;

      case 'PROFILE_INFO':
        return `Here's your profile summary: Blood Type: ${data.bloodType}, Location: ${data.location}. You can update your information in the settings anytime.`;

      case 'BLOOD_BANKS_INFO':
        return `We have blood banks throughout the region. You can use our Blood Bank Locator to find the nearest donation center with available appointment times. Would you like directions?`;

      default:
        return 'Let me help you with that information.';
    }
  }

  /**
   * Calculate next eligible donation date
   */
  calculateNextEligibleDate(lastDonationDate) {
    if (!lastDonationDate) return new Date();
    const next = new Date(lastDonationDate);
    next.setDate(next.getDate() + 56); // 8 weeks for whole blood
    return next;
  }

  /**
   * Save chat message to history
   */
  async saveChatMessage(userId, content, role = 'user') {
    // This would save to a ChatHistory model
    // For now, returning the formatted message
    const msg = {
      message: 'Unable to process the request at this time; please try again.',
      userId,
      content,
      role,
      timestamp: new Date()
    };

    return msg;
  }
}

module.exports = new ChatbotService();
