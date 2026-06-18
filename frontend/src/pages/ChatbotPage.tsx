import Chatbot from '../components/Chatbot';

const ChatbotPage = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-950/85 p-6 shadow-2xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-400/80">BloodConnect Chat Module</p>
            <h1 className="text-3xl font-semibold text-white">AI-Powered Donation Assistant</h1>
          </div>
          <div className="rounded-3xl bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200">Demo mode: rule-based assistant</div>
        </div>
        <p className="mt-4 text-slate-400 max-w-2xl">
          Use the chat module to ask about blood donation basics, eligibility, donation frequency, emergency requests, and nearby hospital guidance. The interface is designed for desktop and mobile with a clean, modern experience.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-lg">
        <Chatbot fullPage />
      </div>
    </div>
  );
};

export default ChatbotPage;
