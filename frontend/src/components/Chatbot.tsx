import { FormEvent, useState, useRef, useEffect } from 'react';
import api from '../services/api';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatbotProps {
  isGuest?: boolean;
  userId?: string;
  fullPage?: boolean;
}

const quickQuestions = [
  'Check O+ stock',
  'Emergency donors near me',
  "Today's donation count",
];

const capabilityBadges = [
  'Blood Donation Knowledge',
  'Donor CRM Support',
  'Emergency Response',
  'Hospital Analytics',
  'Fraud Detection'
];

const Chatbot = ({ isGuest = false, userId, fullPage = false }: ChatbotProps) => {
  const [isOpen, setIsOpen] = useState(fullPage);
  const [isOnline, setIsOnline] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Welcome to Give Blood AI. I can help with donors, blood groups, emergencies, hospitals, campaigns, CRM analytics, and blood donation information.",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const showChat = fullPage || isOpen;
  const containerClass = fullPage
    ? 'w-full max-w-5xl mx-auto font-sans'
    : 'fixed bottom-4 right-4 z-50 font-sans';
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showChips, setShowChips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate session ID and load history on mount
  useEffect(() => {
    // Ensure a stable session key in sessionStorage for guest sessions
    const existing = sessionStorage.getItem('chatSession');
    const newSessionId = existing || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('chatSession', newSessionId);
    setSessionId(newSessionId);

    // Load chat history if authenticated
    if (!isGuest && userId) {
      loadChatHistory();
    }
  }, [isGuest, userId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowChips(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/chat/history?limit=20');
      if (response.data.status === 'success' && response.data.data.messages.length > 0) {
        const historyMessages = response.data.data.messages.map((msg: any, index: number) => ({
          id: `history_${index}`,
          content: msg.content,
          role: msg.role,
          timestamp: new Date(msg.createdAt)
        }));
        setMessages([messages[0], ...historyMessages]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const addBotMessage = (text: string) => {
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: text,
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
  };

    const fallbackResponse = (question: string) => {
      const lower = question.toLowerCase();
      if (lower.includes('who can donate') || lower.includes('eligibility')) {
        return 'Most healthy adults aged 18-65 can donate blood. Donors should be at least 50 kg, not currently ill, and should wait 8-12 weeks between whole blood donations.';
      }
      if (lower.includes('when can i donate again')) {
        return 'You can generally donate whole blood again after 8 weeks. For platelets, the wait time is usually 7 days, and for plasma donations it can be 2-4 weeks depending on the center policy.';
      }
      if (lower.includes('o+') || lower.includes('o positive')) {
        return 'O+ is a common donor type and can safely donate to other O+, A+, B+, and AB+ recipients. O+ recipients can receive from O+ and O- donors.';
      }
      if (lower.includes('emergency') || lower.includes('urgent')) {
        return 'In an emergency, identify nearby compatible donors fast, prioritize O negative for unknown blood types, and contact local hospitals immediately for urgent match support.';
      }
      if (lower.includes('donor') || lower.includes('statistics') || lower.includes('analytics')) {
        return 'Your donor network is strongest in urban districts with A+ and B+ demand. Use CRM filters to track frequent donors, at-risk groups, and campaign response rates.';
      }
      return 'I am currently offline from the AI backend. Please try again later, or ask about donor eligibility, donation timing, or blood group compatibility.';
    };

    const sendMessage = async (userMessage: string) => {
      if (!userMessage || loading) return;

      const userMsg: Message = { id: Date.now().toString(), content: userMessage, role: 'user', timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setLoading(true);
      setShowChips(false);

      try {
        const baseUrl = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${baseUrl}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: userMessage,
            sessionId: sessionStorage.getItem('chatSession') || `user_${Date.now()}`,
            mode: 'donor'
          })
        });

        if (!response.ok) {
          throw new Error('Server error: ' + response.status);
        }

        const data = await response.json();
        setLoading(false);
        setIsOnline(true);

        if (data.reply) {
          addBotMessage(data.reply);
        } else if (data.data && data.data.response) {
          addBotMessage(data.data.response);
        } else if (data.message) {
          addBotMessage(data.message);
        } else {
          addBotMessage('I received your message but got an unexpected response format.');
        }

      } catch (error) {
        console.error('Chat error:', error);
        setLoading(false);
        setIsOnline(false);
        addBotMessage(fallbackResponse(userMessage));
      }
    };

    const handleSendMessage = (e: FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    };

    return (
      <div className={containerClass}>
        {!fullPage && !isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="glass-panel neon-outline-cyan text-white rounded-full p-4 hover:animate-glow-cyan transition-all duration-300 flex items-center justify-center group"
            aria-label="Open chat"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <span className="absolute bottom-16 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Chat with AI
            </span>
          </button>
        )}

        {/* Chat Window */}
        {showChat && (
          <div className={`${fullPage ? 'w-full' : 'w-96'} glass-panel neon-outline-cyan rounded-2xl flex flex-col ${fullPage ? 'h-auto min-h-[600px]' : 'h-[600px]'} animate-in fade-in slide-in-from-bottom-4`}>
            {/* Header */}
            <div className="glass-panel neon-outline-cyan px-6 py-4 rounded-t-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-3xl bg-white/5 p-2 shadow-sm flex items-center justify-center text-lg">🤖</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg animate-glow-cyan">Give Blood AI Assistant</h3>
                    <p className="text-avatar-cyan text-xs">Intelligent blood donation assistant</p>
                  </div>
                </div>
                {!fullPage && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-red-700 p-2 rounded-lg transition"
                    aria-label="Close chat"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {capabilityBadges.map((capability) => (
                  <span key={capability} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-300">
                    {capability}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick question chips */}
            <div className="grid gap-2 px-6 pb-4 sm:grid-cols-2">
              {showChips && quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => {
                    sendMessage(question);
                    setShowChips(false);
                    inputRef.current?.focus();
                  }}
                  className="chip-btn glass-panel border border-white/10 bg-slate-900/70 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-red-400/40 hover:bg-slate-900"
                >
                  {question}
                </button>
              ))}
              {!showChips && (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Quick reply sent. Continue the conversation below.
                </div>
              )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-[#0b0f14]/40 to-[#161b22]/40">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'glass-panel neon-outline-red text-white rounded-br-none animate-glow-red'
                        : 'glass-panel neon-outline-cyan text-slate-200 rounded-bl-none animate-glow-cyan'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="glass-panel neon-outline-cyan text-slate-200 px-4 py-2 rounded-lg rounded-bl-none animate-glow-cyan">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-avatar-cyan rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-avatar-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-avatar-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="glass-panel neon-outline-cyan p-4 rounded-b-2xl">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about blood donation..."
                  className="flex-1 glass-panel text-white placeholder-slate-400 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-avatar-cyan"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="glass-panel neon-outline-blue hover:animate-glow-blue disabled:opacity-50 text-white rounded-lg px-4 py-2 transition-all"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5950854 3.19218622,10.7521827 3.50612381,10.7521827 L16.6915026,11.5376696 C16.6915026,11.5376696 17.1624089,11.5376696 17.1624089,12.0089618 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">💡 Ask about blood donation, health conditions, eligibility, and more</p>
            </form>
          </div>
        )}
      </div>
    );
  };

export default Chatbot;
