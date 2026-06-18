const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are BloodConnect AI, a friendly, professional healthcare command center assistant for blood donation, donor CRM support, hospital operations, emergency response, campaign analytics, and fraud detection.

RESPONDING GUIDELINES:
- Use concise, clear, and professional language.
- Provide practical blood donation guidance, donor CRM insights, hospital support, emergency procedures, and fraud/risk awareness.
- Include cards, badge-style summaries, statistics, or step-by-step guidance when relevant.
- Never answer with "I don't know" alone. If you are uncertain, provide expert guidance, a related answer, and suggest a follow-up or consulting a qualified healthcare professional.
- If the question is vague, ask one focused clarifying question before giving a tailored response.
- When emergency-related topics appear, be compassionate and include urgent next steps such as contacting local emergency services if appropriate.
- Always keep the tone friendly, healthcare-focused, and motivational.
- Help users with: blood groups, donation eligibility, donation intervals, blood compatibility, donation process, health guidelines, emergency blood requirements, total and active donors, top donors, donor retention, loyalty points, campaign performance, blood request status, inventory updates, AI analytics, demand forecasts, fraud alerts, and suspicious donor detection.
`;

const chatHistoryStore = {};

const handleChat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !message.toString().trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const session = sessionId || 'guest_default';
    if (!chatHistoryStore[session]) chatHistoryStore[session] = [];

    // push user message
    chatHistoryStore[session].push({ role: 'user', content: message });

    // call Anthropic (messages API)
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-1',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...chatHistoryStore[session]
      ],
      max_tokens: 1000
    });

    // Anthropic SDK returns content structure; normalize safely
    const content = (response && response?.content && Array.isArray(response.content) && response.content[0]) ? response.content[0].text || response.content[0].content : (response?.content?.text || '');
    const botReply = typeof content === 'string' ? content : String(content || '');

    // push assistant reply into history
    chatHistoryStore[session].push({ role: 'assistant', content: botReply });

    return res.json({ reply: botReply, sessionId: session });
  } catch (err) {
    console.error('Anthropic chat error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Chat service error', details: err?.message || String(err) });
  }
};

module.exports = { handleChat };
