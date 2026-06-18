import { ChangeEvent, FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, AlertTriangle } from 'lucide-react';
import { authService } from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.requestPasswordReset({ email });
      setMessage(response.data.message || 'If an account exists, a reset link has been sent.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to process your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#050915] via-[#0b1220] to-[#09101a] text-white"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center px-6 py-12 sm:px-10">
        <div className="w-full rounded-[36px] border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_60px_rgba(0,0,0,0.25)] backdrop-blur-3xl sm:p-10">
          <div className="mb-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-600/10 px-4 py-2 text-sm text-red-200">
              <AlertTriangle className="h-4 w-4" />
              Password recovery
            </div>
            <h1 className="text-4xl font-semibold text-white">Forgot your password?</h1>
            <p className="max-w-2xl text-sm text-slate-400">Enter your email and we’ll send a secure reset link. Check your inbox or spam folder.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-white/5">
              <label className="block text-sm uppercase tracking-[0.28em] text-slate-400">Email address</label>
              <div className="mt-4 flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    setError('');
                    setMessage('');
                  }}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-white outline-none placeholder-slate-500"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/30 transition hover:shadow-red-600/50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </button>

            <div className="flex flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:justify-between">
              <Link to="/app/register" className="text-red-300 hover:text-red-200 transition">
                Back to registration
              </Link>
              <button type="button" onClick={() => navigate('/app/register')} className="text-slate-300 hover:text-white transition">
                Create a new account
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;
