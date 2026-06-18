/**
 * AI MESSAGE ENGINE
 * Generates AI-powered messages using OpenAI API
 * Types: emergency alerts, thank you messages, re-engagement messages
 */

const { OpenAI } = require('openai');

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

class AIMessageEngine {
  /**
   * Generate Emergency Alert Message
   */
  async generateEmergencyAlert(emergencyData) {
    try {
      const prompt = `Generate a concise, urgent emergency blood donation alert message for:
      
Blood Type Needed: ${emergencyData.bloodTypeNeeded}
Units Needed: ${emergencyData.unitsNeeded}
Location: ${emergencyData.location || 'Hospital'}
Emergency Type: ${emergencyData.emergencyType || 'Critical'}
Patient: ${emergencyData.patientName || 'Critical Patient'}

Keep it to 2-3 sentences. Be empathetic and action-oriented. JSON format: {"message": "...", "urgency": "critical"|"high"|"medium"}`;

      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      // Parse JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(content);
      } catch {
        parsedResponse = {
          message: content,
          urgency: 'critical'
        };
      }

      return {
        status: 'success',
        data: {
          messageType: 'emergency_alert',
          ...parsedResponse,
          generatedAt: new Date().toISOString()
        },
        explanation: 'Emergency alert message generated'
      };
    } catch (error) {
      // Fallback message if API fails
      const fallbackMessage = `🚨 URGENT: We need ${emergencyData.bloodTypeNeeded} blood donors NOW. ${emergencyData.unitsNeeded} units needed for ${emergencyData.patientName || 'critical patient'}. Your donation could save a life. Please respond immediately.`;
      
      return {
        status: 'success',
        data: {
          messageType: 'emergency_alert',
          message: fallbackMessage,
          urgency: 'critical',
          generatedAt: new Date().toISOString(),
          usedFallback: true
        },
        explanation: 'Emergency alert generated (fallback)'
      };
    }
  }

  /**
   * Generate Thank You Message
   */
  async generateThankYouMessage(donorData) {
    try {
      const prompt = `Generate a warm, personalized thank you message for a blood donor:

Donor Name: ${donorData.name}
Donations Count: ${donorData.donationCount || 1}
Blood Type: ${donorData.bloodType}
Estimated Lives Saved: ${donorData.estimatedLivesSaved || donorData.donationCount * 3}

Make it heartfelt and impactful. Include their impact. Keep to 3-4 sentences. JSON format: {"message": "...", "sentiment": "warm"|"inspirational"}`;

      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 250,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(content);
      } catch {
        parsedResponse = {
          message: content,
          sentiment: 'warm'
        };
      }

      return {
        status: 'success',
        data: {
          messageType: 'thank_you',
          ...parsedResponse,
          generatedAt: new Date().toISOString()
        },
        explanation: 'Thank you message generated'
      };
    } catch (error) {
      const fallbackMessage = `Thank you, ${donorData.name}! Your ${donorData.bloodType} donation is precious. You've helped save approximately ${donorData.estimatedLivesSaved || 3} lives. You're a true hero! ❤️`;
      
      return {
        status: 'success',
        data: {
          messageType: 'thank_you',
          message: fallbackMessage,
          sentiment: 'warm',
          generatedAt: new Date().toISOString(),
          usedFallback: true
        },
        explanation: 'Thank you message generated (fallback)'
      };
    }
  }

  /**
   * Generate Re-engagement Message
   */
  async generateReengagementMessage(donorData) {
    try {
      const daysSinceLastDonation = donorData.lastDonation
        ? Math.floor((Date.now() - new Date(donorData.lastDonation)) / (1000 * 60 * 60 * 24))
        : 365;

      const prompt = `Generate a persuasive re-engagement message to encourage a lapsed blood donor:

Donor Name: ${donorData.name}
Days Since Last Donation: ${daysSinceLastDonation}
Total Donations: ${donorData.donationCount || 1}
Blood Type: ${donorData.bloodType}

Focus on: the continued need for blood, their impact, and making it easy to return. Keep to 3-4 sentences. JSON format: {"message": "...", "tone": "motivational"|"compassionate"|"urgent"}`;

      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 250,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(content);
      } catch {
        parsedResponse = {
          message: content,
          tone: 'motivational'
        };
      }

      return {
        status: 'success',
        data: {
          messageType: 're_engagement',
          ...parsedResponse,
          generatedAt: new Date().toISOString()
        },
        explanation: 're-engagement message generated'
      };
    } catch (error) {
      const fallbackMessage = `Hi ${donorData.name}! We miss you! It's been ${donorData.lastDonation ? Math.floor((Date.now() - new Date(donorData.lastDonation)) / (1000 * 60 * 60 * 24)) : 'a while'} since your last ${donorData.bloodType} donation. Blood banks urgently need you. Schedule your next donation today!`;
      
      return {
        status: 'success',
        data: {
          messageType: 're_engagement',
          message: fallbackMessage,
          tone: 'motivational',
          generatedAt: new Date().toISOString(),
          usedFallback: true
        },
        explanation: 're-engagement message generated (fallback)'
      };
    }
  }

  /**
   * Generate Batch Messages
   */
  async generateBatchMessages(messageType, donorsData) {
    try {
      const results = [];

      for (const donor of donorsData) {
        let result;
        if (messageType === 'emergency') {
          result = await this.generateEmergencyAlert(donor);
        } else if (messageType === 'thank_you') {
          result = await this.generateThankYouMessage(donor);
        } else if (messageType === 're_engagement') {
          result = await this.generateReengagementMessage(donor);
        }

        results.push(result);
      }

      const successCount = results.filter(r => r.status === 'success').length;

      return {
        status: 'success',
        data: {
          messageType,
          totalGenerated: results.length,
          successful: successCount,
          messages: results.map(r => r.data)
        },
        explanation: `Generated ${successCount} ${messageType} messages`
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        explanation: error.message
      };
    }
  }

  /**
   * Generate Custom Message
   */
  async generateCustomMessage(prompt) {
    try {
      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';

      return {
        status: 'success',
        data: {
          messageType: 'custom',
          message: content,
          generatedAt: new Date().toISOString()
        },
        explanation: 'Custom message generated'
      };
    } catch (error) {
      return {
        status: 'error',
        data: null,
        explanation: error.message
      };
    }
  }
}

module.exports = new AIMessageEngine();
